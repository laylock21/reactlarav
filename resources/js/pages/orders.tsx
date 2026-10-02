import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type OrderItemInput = { product_id: number | null; quantity: number };

type Order = {
    id: number;
    order_number: string;
    customer_id: number;
    customer_type: string;
    customer_reference: string | null;
    platform: string;
    status: string;
    total_amount: number | string;
    notes: string | null;
    ordered_at: string;
    order_items_count?: number;
    customer?: { id: number; name: string } | null;
    user?: { id: number; name: string } | null;
};

type OrderDetail = Order & {
    order_items: {
        id: number;
        product_id: number;
        quantity: number;
        unit_price: number | string;
        total_amount: number | string;
        product?: { id: number; name: string; sku: string } | null;
    }[];
};

type CustomerOption = { id: number; name: string };
type ProductOption = { id: number; name: string; sku: string; quantity: number; selling_price: number | string };

type OrderForm = {
    customer_id: number | null;
    customer_type: string;
    customer_reference: string;
    platform: string;
    status: string;
    notes: string;
    items: OrderItemInput[];
};

const emptyOrderForm: OrderForm = {
    customer_id: null,
    customer_type: "in store",
    customer_reference: "",
    platform: "shopee",
    status: "packed",
    notes: "",
    items: [{ product_id: null, quantity: 1 }],
};

const STATUSES = ["packed", "out for delivery", "delivered"];
const PLATFORMS = ["shopee", "lazada", "tiktok"];

type Props = {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    customers: CustomerOption[];
    products: ProductOption[];
    filters?: { search?: string };
};

export default function Orders({ orders: orderList, customers, products, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [ordersData, setOrdersData] = useState(orderList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
    const [detail, setDetail] = useState<OrderDetail | null>(null);
    const [form, setForm] = useState<OrderForm>(emptyOrderForm);

    useEffect(() => setOrdersData(orderList.data), [orderList.data]);

    const filteredOrders = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? ordersData.filter((order) =>
                [order.order_number, order.customer?.name ?? "", order.platform, order.status]
                    .join(" ")
                    .toLowerCase()
                    .includes(value)
            )
            : ordersData;
    }, [ordersData, search]);

    const allSelected = filteredOrders.length > 0 && selectedRows.length === filteredOrders.length;
    const toggleAll = (checked: boolean | "indeterminate") =>
        setSelectedRows(checked ? filteredOrders.map((order) => order.id) : []);
    const toggleRow = (id: number, checked: boolean | "indeterminate") =>
        setSelectedRows((current) => (checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id)));

    const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
    const formTotal = form.items.reduce((sum, item) => {
        const product = item.product_id ? productById.get(item.product_id) : undefined;
        return sum + (product ? Number(product.selling_price) * item.quantity : 0);
    }, 0);

    const openCreate = () => { setEditingOrder(null); setForm(emptyOrderForm); setFormOpen(true); };
    const openEdit = (order: Order) => {
        setEditingOrder(order);
        setForm({
            customer_id: order.customer_id,
            customer_type: order.customer_type,
            customer_reference: order.customer_reference ?? "",
            platform: order.platform,
            status: order.status,
            notes: order.notes ?? "",
            items: [],
        });
        setFormOpen(true);
    };
    const openDetail = async (order: Order) => {
        setDetail(null);
        setViewOpen(true);

        try {
            const response = await fetch(`/orders/${order.id}`, { headers: { Accept: "application/json" } });
            setDetail(await response.json());
        } catch {
            toast.error("Unable to load order details.");
            setViewOpen(false);
        }
    };

    const setItem = (index: number, patch: Partial<OrderItemInput>) =>
        setForm((current) => ({ ...current, items: current.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));
    const addItem = () => setForm((current) => ({ ...current, items: [...current.items, { product_id: null, quantity: 1 }] }));
    const removeItem = (index: number) =>
        setForm((current) => ({ ...current, items: current.items.filter((_, i) => i !== index) }));

    const saveOrder = () => {
        const payload = editingOrder
            ? {
                customer_id: form.customer_id,
                customer_type: form.customer_type,
                customer_reference: form.customer_reference || null,
                platform: form.platform,
                status: form.status,
                notes: form.notes || null,
            }
            : {
                customer_id: form.customer_id,
                customer_type: form.customer_type,
                customer_reference: form.customer_reference || null,
                platform: form.platform,
                notes: form.notes || null,
                items: form.items
                    .filter((item) => item.product_id !== null)
                    .map((item) => ({ product_id: item.product_id, quantity: Math.max(1, item.quantity) })),
            };
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingOrder(null);
                setForm(emptyOrderForm);
                router.reload({ only: ["orders"] });
                toast.success(editingOrder ? "Order updated successfully." : "Order created successfully.");
            },
            onError: () => toast.error("Unable to save order. Check the customer and items."),
        };
        editingOrder ? router.put(`/orders/${editingOrder.id}`, payload, options) : router.post("/orders", payload, options);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/orders/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setOrdersData((prev) => prev.filter((order) => order.id !== deleteTarget.id));
                    setDeleteOpen(false);
                    setDeleteTarget(null);
                    toast.success("Order deleted successfully.");
                },
                onError: (errors: Record<string, string>) => toast.error(errors.order ?? "This order cannot be deleted."),
            });
            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];
            ids.forEach((id) =>
                router.delete(`/orders/${id}`, {
                    preserveScroll: true,
                    onError: (errors: Record<string, string>) => toast.error(errors.order ?? "A selected order could not be deleted."),
                })
            );
            setOrdersData((prev) => prev.filter((order) => !ids.includes(order.id)));
            setSelectedRows([]);
            setDeleteOpen(false);
            toast.success(`${ids.length} orders deleted successfully.`);
        }
    };

    const canSave = form.customer_id !== null && (editingOrder !== null || form.items.some((item) => item.product_id !== null));

    return (
        <>
            <Head title="Orders" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Orders</h1>
                        <p className="text-muted-foreground">Create and manage orders across all platforms.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get("/orders", { search: value }, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => { setDeleteTarget(null); setDeleteOpen(true); }}
                                    className="transition-colors duration-300 ease-out"
                                >
                                    <Trash2 className={`mr-2 h-4 w-4 transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`} />
                                    <span className={`transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`}>
                                        Delete
                                    </span>
                                </Button>
                                <Button onClick={openCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Order
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead className="w-12">
                                                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all orders" />
                                            </TableHead>
                                            <TableHead className="w-12" />
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Platform</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Items</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead>Ordered</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(order.id)}
                                                        onCheckedChange={(checked) => toggleRow(order.id, checked)}
                                                        aria-label={`Select ${order.order_number}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label={`Actions for ${order.order_number}`}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                                                            <DropdownMenuItem onClick={() => openDetail(order)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(order)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Order
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => { setDeleteTarget(order); setDeleteOpen(true); }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                                <TableCell>{order.customer?.name ?? "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">{order.platform}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{order.order_items_count ?? 0}</TableCell>
                                                <TableCell className="text-right">₱{Number(order.total_amount).toLocaleString()}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : "—"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredOrders.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                                    No orders found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Go to page</span>
                        <select
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                            value={orderList.current_page}
                            onChange={(e) => router.get(`/orders?page=${e.target.value}`)}
                        >
                            {Array.from({ length: orderList.last_page }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" disabled={orderList.current_page === 1} onClick={() => orderList.prev_page_url && router.get(orderList.prev_page_url)}>
                            Previous
                        </Button>
                        {Array.from({ length: Math.max(orderList.last_page, 5) }, (_, i) => (
                            <Button
                                key={i}
                                variant={orderList.current_page === i + 1 ? "default" : "outline"}
                                disabled={i + 1 > orderList.last_page}
                                onClick={() => router.get(`/orders?page=${i + 1}`)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button variant="outline" disabled={orderList.current_page === orderList.last_page} onClick={() => orderList.next_page_url && router.get(orderList.next_page_url)}>
                            Next
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {orderList.current_page} of {orderList.last_page}
                    </div>
                </div>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingOrder ? `Edit ${editingOrder.order_number}` : "Add Order"}</DialogTitle>
                        <DialogDescription>
                            {editingOrder ? "Line items cannot be changed after creation." : "Select a customer and add product line items."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <Select
                                    value={form.customer_id?.toString() ?? ""}
                                    onValueChange={(value) => setForm({ ...form, customer_id: Number(value) })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Customer type</Label>
                                <Select value={form.customer_type} onValueChange={(value) => setForm({ ...form, customer_type: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in store">In store</SelectItem>
                                        <SelectItem value="online">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={form.platform} onValueChange={(value) => setForm({ ...form, platform: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PLATFORMS.map((platform) => (
                                            <SelectItem key={platform} value={platform} className="capitalize">{platform}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {editingOrder && (
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {STATUSES.map((status) => (
                                                <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="order-reference">Customer reference</Label>
                                <Input
                                    id="order-reference"
                                    value={form.customer_reference}
                                    onChange={(event) => setForm({ ...form, customer_reference: event.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        {!editingOrder && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Items</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="mr-2 h-4 w-4" /> Add item
                                    </Button>
                                </div>
                                {form.items.map((item, index) => {
                                    const product = item.product_id ? productById.get(item.product_id) : undefined;
                                    return (
                                        <div key={index} className="grid grid-cols-[1fr_100px_110px_40px] items-center gap-2">
                                            <Select
                                                value={item.product_id?.toString() ?? ""}
                                                onValueChange={(value) => setItem(index, { product_id: Number(value) })}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                                                <SelectContent>
                                                    {products.map((option) => (
                                                        <SelectItem key={option.id} value={option.id.toString()}>
                                                            {option.name} (₱{Number(option.selling_price).toLocaleString()} · stock {option.quantity})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(event) => setItem(index, { quantity: Math.max(1, Number(event.target.value)) })}
                                                aria-label="Quantity"
                                            />
                                            <span className="text-right text-sm text-muted-foreground">
                                                ₱{product ? (Number(product.selling_price) * item.quantity).toLocaleString() : "0"}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                disabled={form.items.length === 1}
                                                onClick={() => removeItem(index)}
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                                <p className="text-right text-sm font-medium">Total: ₱{formTotal.toLocaleString()}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="order-notes">Notes</Label>
                            <Textarea
                                id="order-notes"
                                value={form.notes}
                                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveOrder} disabled={!canSave}>
                            {editingOrder ? "Save Changes" : "Add Order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{detail ? detail.order_number : "Order details"}</DialogTitle>
                        <DialogDescription>
                            {detail ? `${detail.customer?.name ?? ""} · ${detail.platform} · ${detail.status}` : "Loading..."}
                        </DialogDescription>
                    </DialogHeader>
                    {detail && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {detail.order_items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.product?.name ?? "—"}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">₱{Number(item.unit_price).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₱{Number(item.total_amount).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <DialogFooter>
                        <span className="mr-auto text-sm font-medium">Total: ₱{detail ? Number(detail.total_amount).toLocaleString() : "0"}</span>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Order</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.order_number}" and its items? Stock levels are left untouched.`
                                : `Delete ${selectedRows.length} selected orders and their items?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Orders.layout = {
    breadcrumbs: [{ title: "Orders", href: "/orders" }],
};
