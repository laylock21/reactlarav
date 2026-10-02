import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Stock = {
    id: number;
    product_id: number;
    type: string;
    quantity: number;
    status: string;
    reference_number: string | null;
    notes: string | null;
    created_at: string;
    product?: { id: number; name: string; sku: string } | null;
};

type StockForm = {
    type: string;
    quantity: number;
    status: string;
    reference_number: string;
    notes: string;
};

const emptyStockForm: StockForm = {
    type: "stock in",
    quantity: 0,
    status: "delivered",
    reference_number: "",
    notes: "",
};

const STOCK_TYPES = ["stock in", "stock out", "adjustment"];
const STOCK_STATUSES = ["packed", "out for delivery", "delivered"];

type Props = {
    stocks: {
        data: Stock[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: { search?: string };
};

export default function Stocks({ stocks: stockList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [stocks, setStocks] = useState(stockList.data);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Stock | null>(null);
    const [form, setForm] = useState<StockForm>(emptyStockForm);

    useEffect(() => setStocks(stockList.data), [stockList.data]);

    const filteredStocks = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? stocks.filter((stock) =>
                [stock.product?.name ?? "", stock.reference_number ?? "", stock.type, stock.status]
                    .join(" ")
                    .toLowerCase()
                    .includes(value)
            )
            : stocks;
    }, [stocks, search]);

    const openEdit = (stock: Stock) => {
        setEditingStock(stock);
        setForm({
            type: stock.type,
            quantity: stock.quantity,
            status: stock.status,
            reference_number: stock.reference_number ?? "",
            notes: stock.notes ?? "",
        });
        setFormOpen(true);
    };

    const saveStock = () => {
        if (!editingStock) {
            return;
        }

        router.put(`/stocks/${editingStock.id}`, form, {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingStock(null);
                setForm(emptyStockForm);
                toast.success("Stock entry updated successfully.");
            },
            onError: () => toast.error("Unable to save stock entry."),
        });
    };

    const confirmDelete = (stock: Stock) => {
        router.delete(`/stocks/${stock.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setStocks((prev) => prev.filter((entry) => entry.id !== stock.id));
                setDeleteOpen(false);
                setDeleteTarget(null);
                toast.success("Stock entry deleted successfully.");
            },
            onError: () => toast.error("Unable to delete stock entry."),
        });
    };

    return (
        <>
            <Head title="Stock Management" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Stock Management</h1>
                        <p className="text-muted-foreground">Correct or remove stock entries. New entries are recorded from products.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search stocks..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get("/stocks", { search: value }, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead className="w-12" />
                                            <TableHead>Product</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Notes</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStocks.map((stock) => (
                                            <TableRow key={stock.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label={`Actions for stock entry ${stock.id}`}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                                                            <DropdownMenuItem onClick={() => openEdit(stock)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Entry
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => { setDeleteTarget(stock); setDeleteOpen(true); }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium">{stock.product?.name ?? "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">{stock.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{stock.quantity}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{stock.status}</Badge>
                                                </TableCell>
                                                <TableCell>{stock.reference_number ?? "—"}</TableCell>
                                                <TableCell className="max-w-xs truncate text-muted-foreground">{stock.notes ?? "—"}</TableCell>
                                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                                    {new Date(stock.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredStocks.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                                    No stocks found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Page {stockList.current_page} of {stockList.last_page}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!stockList.prev_page_url}
                            onClick={() => stockList.prev_page_url && router.get(stockList.prev_page_url)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!stockList.next_page_url}
                            onClick={() => stockList.next_page_url && router.get(stockList.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Stock Entry</DialogTitle>
                        <DialogDescription>
                            Correct this ledger entry{editingStock?.product ? ` for ${editingStock.product.name}` : ""}. The product link cannot be changed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STOCK_TYPES.map((type) => (
                                            <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock-quantity">Quantity</Label>
                                <Input
                                    id="stock-quantity"
                                    type="number"
                                    min={0}
                                    value={form.quantity}
                                    onChange={(event) => setForm({ ...form, quantity: Math.max(0, Number(event.target.value)) })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STOCK_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock-reference">Reference</Label>
                                <Input
                                    id="stock-reference"
                                    value={form.reference_number}
                                    onChange={(event) => setForm({ ...form, reference_number: event.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock-notes">Notes</Label>
                            <Textarea
                                id="stock-notes"
                                value={form.notes}
                                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveStock}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Stock Entry</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Permanently delete this ${deleteTarget.type} entry of ${deleteTarget.quantity} for "${deleteTarget.product?.name ?? "the product"}"? Product stock levels are left untouched.`
                                : "Delete this entry?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteTarget && confirmDelete(deleteTarget)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Stocks.layout = {
    breadcrumbs: [{ title: "Stock Management", href: "/stocks" }],
};
