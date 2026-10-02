import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    orders_count?: number;
};

type CustomerForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

const emptyCustomerForm: CustomerForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
};

type Props = {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: { search?: string };
};

export default function Customers({ customers: customerList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [customersData, setCustomersData] = useState(customerList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
    const [form, setForm] = useState<CustomerForm>(emptyCustomerForm);

    useEffect(() => setCustomersData(customerList.data), [customerList.data]);

    const filteredCustomers = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? customersData.filter((customer) =>
                [customer.name, customer.email, customer.phone, customer.address]
                    .join(" ")
                    .toLowerCase()
                    .includes(value)
            )
            : customersData;
    }, [customersData, search]);

    const allSelected = filteredCustomers.length > 0 && selectedRows.length === filteredCustomers.length;
    const toggleAll = (checked: boolean | "indeterminate") =>
        setSelectedRows(checked ? filteredCustomers.map((customer) => customer.id) : []);
    const toggleRow = (id: number, checked: boolean | "indeterminate") =>
        setSelectedRows((current) => (checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id)));

    const openCreate = () => { setEditingCustomer(null); setForm(emptyCustomerForm); setFormOpen(true); };
    const openEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setForm({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
        setFormOpen(true);
    };

    const saveCustomer = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingCustomer(null);
                setForm(emptyCustomerForm);
                toast.success(editingCustomer ? "Customer updated successfully." : "Customer added successfully.");
            },
            onError: () => toast.error("Unable to save customer. Check the name, email, and phone number."),
        };
        editingCustomer ? router.put(`/customers/${editingCustomer.id}`, form, options) : router.post("/customers", form, options);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/customers/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCustomersData((prev) => prev.filter((customer) => customer.id !== deleteTarget.id));
                    setDeleteOpen(false);
                    setDeleteTarget(null);
                    toast.success("Customer deleted successfully.");
                },
                onError: (errors: Record<string, string>) => toast.error(errors.customer ?? "This customer cannot be deleted because orders are still assigned to it."),
            });
            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];
            ids.forEach((id) =>
                router.delete(`/customers/${id}`, {
                    preserveScroll: true,
                    onError: (errors: Record<string, string>) => toast.error(errors.customer ?? "A selected customer could not be deleted because orders are still assigned to it."),
                })
            );
            setCustomersData((prev) => prev.filter((customer) => !ids.includes(customer.id)));
            setSelectedRows([]);
            setDeleteOpen(false);
            toast.success(`${ids.length} customers deleted successfully.`);
        }
    };

    return (
        <>
            <Head title="Customers" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Customers</h1>
                        <p className="text-muted-foreground">Manage customers and their orders.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get("/customers", { search: value }, { preserveState: true, preserveScroll: true, replace: true });
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
                                    Add Customer
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
                                                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all customers" />
                                            </TableHead>
                                            <TableHead className="w-12" />
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead className="text-right">Orders</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCustomers.map((customer) => (
                                            <TableRow key={customer.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(customer.id)}
                                                        onCheckedChange={(checked) => toggleRow(customer.id, checked)}
                                                        aria-label={`Select ${customer.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label={`Actions for ${customer.name}`}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                                                            <DropdownMenuItem onClick={() => openEdit(customer)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Customer
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => { setDeleteTarget(customer); setDeleteOpen(true); }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium">{customer.name}</TableCell>
                                                <TableCell>{customer.email}</TableCell>
                                                <TableCell>{customer.phone}</TableCell>
                                                <TableCell className="max-w-xs truncate text-muted-foreground">{customer.address}</TableCell>
                                                <TableCell className="text-right">{customer.orders_count ?? 0}</TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredCustomers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    No customers found.
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
                        <span className="text-sm text-muted-foreground">
                            Go to page
                        </span>
                        <select
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                            value={customerList.current_page}
                            onChange={(e) => router.get(`/customers?page=${e.target.value}`)}
                        >
                            {Array.from({ length: customerList.last_page }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={customerList.current_page === 1}
                            onClick={() => customerList.prev_page_url && router.get(customerList.prev_page_url)}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.max(customerList.last_page, 5) }, (_, i) => (
                            <Button
                                key={i}
                                variant={customerList.current_page === i + 1 ? "default" : "outline"}
                                disabled={i + 1 > customerList.last_page}
                                onClick={() => router.get(`/customers?page=${i + 1}`)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            disabled={customerList.current_page === customerList.last_page}
                            onClick={() => customerList.next_page_url && router.get(customerList.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {customerList.current_page} of {customerList.last_page}
                    </div>
                </div>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
                        <DialogDescription>Enter the customer details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="customer-name">Name</Label>
                            <Input id="customer-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Customer name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-email">Email</Label>
                                <Input id="customer-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="customer@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">Phone</Label>
                                <Input id="customer-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="09170000001" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-address">Address</Label>
                            <Textarea id="customer-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Address" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveCustomer} disabled={!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()}>
                            {editingCustomer ? "Save Changes" : "Add Customer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Customer</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.name}"?`
                                : `Delete ${selectedRows.length} selected customers?`}
                            {deleteTarget && (deleteTarget.orders_count ?? 0) > 0
                                ? ` This customer has ${deleteTarget.orders_count} ${deleteTarget.orders_count === 1 ? "order" : "orders"} assigned. It cannot be deleted until they are reassigned or removed.`
                                : ""}
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

Customers.layout = {
    breadcrumbs: [{ title: "Customers", href: "/customers" }],
};
