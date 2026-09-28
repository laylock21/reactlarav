import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SuppliersPagination } from "@/components/suppliers/suppliers-pagination";
import { SuppliersTable } from "@/components/suppliers/suppliers-table";
import { SuppliersToolbar } from "@/components/suppliers/suppliers-toolbar";
import { emptySupplierForm, type Supplier, type SupplierForm, type SupplierList } from "@/components/suppliers/suppliers-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    suppliers: SupplierList;
    filters?: { search?: string };
};

export default function Suppliers({ suppliers: supplierList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [suppliersData, setSuppliersData] = useState(supplierList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
    const [form, setForm] = useState<SupplierForm>(emptySupplierForm);

    useEffect(() => setSuppliersData(supplierList.data), [supplierList.data]);

    const filteredSuppliers = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? suppliersData.filter((supplier) =>
                [supplier.name, supplier.contact_person ?? "", supplier.phone ?? "", supplier.email ?? "", supplier.address ?? ""]
                    .join(" ")
                    .toLowerCase()
                    .includes(value)
            )
            : suppliersData;
    }, [suppliersData, search]);

    const openCreate = () => { setEditingSupplier(null); setForm(emptySupplierForm); setFormOpen(true); };
    const openEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setForm({
            name: supplier.name,
            contact_person: supplier.contact_person ?? "",
            phone: supplier.phone ?? "",
            email: supplier.email ?? "",
            address: supplier.address ?? "",
        });
        setFormOpen(true);
    };

    const saveSupplier = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingSupplier(null);
                setForm(emptySupplierForm);
                toast.success(editingSupplier ? "Supplier updated successfully." : "Supplier added successfully.");
            },
            onError: () => toast.error("Unable to save supplier. Check the name and email address."),
        };
        editingSupplier ? router.put(`/suppliers/${editingSupplier.id}`, form, options) : router.post("/suppliers", form, options);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/suppliers/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setSuppliersData((prev) => prev.filter((supplier) => supplier.id !== deleteTarget.id));
                    setDeleteOpen(false);
                    setDeleteTarget(null);
                    toast.success("Supplier deleted successfully.");
                },
                onError: (errors: Record<string, string>) => toast.error(errors.supplier ?? "This supplier cannot be deleted because products are still assigned to it."),
            });
            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];
            ids.forEach((id) =>
                router.delete(`/suppliers/${id}`, {
                    preserveScroll: true,
                    onError: (errors: Record<string, string>) => toast.error(errors.supplier ?? "A selected supplier could not be deleted because products are still assigned to it."),
                })
            );
            setSuppliersData((prev) => prev.filter((supplier) => !ids.includes(supplier.id)));
            setSelectedRows([]);
            setDeleteOpen(false);
            toast.success(`${ids.length} suppliers deleted successfully.`);
        }
    };

    return (
        <>
            <Head title="Suppliers" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Suppliers</h1>
                        <p className="text-muted-foreground">Manage product suppliers.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <SuppliersToolbar
                            search={search}
                            setSearch={setSearch}
                            selectedRows={selectedRows}
                            setDeleteTarget={setDeleteTarget}
                            setDeleteOpen={setDeleteOpen}
                            setBulkDelete={setBulkDelete}
                            onAddSupplier={openCreate}
                        />
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <SuppliersTable
                            suppliers={filteredSuppliers}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            setBulkDelete={setBulkDelete}
                            setDeleteTarget={setDeleteTarget}
                            setDeleteOpen={setDeleteOpen}
                            onEdit={openEdit}
                        />
                    </CardContent>
                </Card>
                <SuppliersPagination supplierList={supplierList} />
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
                        <DialogDescription>Enter the supplier details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplier-name">Name</Label>
                            <Input id="supplier-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Supplier name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier-contact">Contact person</Label>
                                <Input id="supplier-contact" value={form.contact_person} onChange={(event) => setForm({ ...form, contact_person: event.target.value })} placeholder="Juan Dela Cruz" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supplier-phone">Phone</Label>
                                <Input id="supplier-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="09171234567" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier-email">Email</Label>
                            <Input id="supplier-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="sales@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier-address">Address</Label>
                            <Textarea id="supplier-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Address" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveSupplier} disabled={!form.name.trim()}>{editingSupplier ? "Save Changes" : "Add Supplier"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Supplier</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.name}"?`
                                : `Delete ${selectedRows.length} selected suppliers?`}
                            {deleteTarget && (deleteTarget.products_count ?? 0) > 0
                                ? ` This supplier has ${deleteTarget.products_count} ${deleteTarget.products_count === 1 ? "product" : "products"} assigned. It cannot be deleted until they are reassigned.`
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

Suppliers.layout = {
    breadcrumbs: [{ title: "Suppliers", href: "/suppliers" }],
};
