import { Head, router } from "@inertiajs/react";
import { toast } from "sonner";
import products from "@/routes/products";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ProductDialog } from "@/components/products/partials/product-dialog";

import { useEffect, useMemo, useState } from "react";
import { ProductViewDialog } from "@/components/products/partials/product-view-dialog";
import { ProductsToolbar } from "@/components/products/products-toolbar";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductsTable } from "@/components/products/products-table";
import type {
    ProductForm,
    ProductStatus,
} from "@/components/products/products-types";

import {
    MoreVertical,
    Pencil,
    Eye,
    Copy,
    Trash2,
    Package,
    Archive,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import type { Category } from "@/components/categories/categories-types";

type Props = {
    products: {
        data: Product[];

        current_page: number;

        last_page: number;

        prev_page_url: string | null;

        next_page_url: string | null;
    };

    categories: Category[];

    getStatusColor: (status: string) => string;

    archiveProduct: (product: Product) => void;

    duplicateProduct: (product: Product) => void;
};

export default function Products({ products: productList, categories }: Props) {
    const [search, setSearch] = useState("");
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusProduct, setStatusProduct] = useState<Product | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const emptyForm = {
        sku: "",
        barcode: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        quantity: 0,
        minimum_stock: 0,
        cost_price: 0,
        selling_price: 0,
        status: "Pending",
        description: "",
        archived: false,
    };

const archiveSelected = () => {
    if (selectedRows.length === 0) {
        return;
    }

    const ids = [...selectedRows];

    ids.forEach((id) => {
        router.patch(products.archive(id).url, {}, {
            preserveScroll: true,
        });
    });

    setProductsData((prev) =>
        prev.filter((product) => !ids.includes(product.id))
    );

    setSelectedRows([]);

    toast.success(
        `${ids.length} products archived successfully.`,
        {
            description:
                "The selected products have been moved to the archived products.",
        }
    );
};

const [form, setForm] = useState<ProductForm>(emptyForm);
    const [statusFilter, setStatusFilter] =
    useState<ProductStatus>("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "bg-green-600";
            case "Pending":
                return "bg-yellow-500";
            case "In Transit":
                return "bg-blue-600";
            default:
                return "bg-gray-500";
        }
    };

    const saveProduct = () => {
        if (editingProduct) {
            router.put(products.update(editingProduct.id).url, form, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setOpen(false);
                    setEditingProduct(null);
                    setForm(emptyForm);

                    toast.success("Changes saved.", {
                        description: "The product has been updated successfully.",
                    });
                }, 
                onError: () => {
                    toast.error("Unable to update product.", {
                        description: "There was an error while updating the product.",
                    });
                }
            });
        } else {
            router.post(products.store().url, form, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setOpen(false);
                    setForm(emptyForm);

                    toast.success("Product added successfully.", {
                        description: "The product has been added successfully.",
                    });
                },
                onError: () => {
                    toast.error("Unable to add product.", {
                        description: "There was an error while adding the product.",
                    });
                }
            });
        }
    };

   const archiveProduct = (product: Product) => {
        router.patch(products.archive(product.id).url, {}, {
            preserveScroll: true,

            onSuccess: () => {
                router.reload({
                    only: ["products"],
                });

                toast.success("Product archived successfully.", {
                    description:
                        "The product has been moved to the archived products.",
                });
            },

            onError: () => {
                toast.error("Unable to archive product.", {
                    description:
                        "There was an error while archiving the product.",
                });
            },
        });
    };

    const duplicateProduct = (product: Product) => {
        router.post(products.duplicate(product.id).url, {}, {
            preserveScroll: true,

            onSuccess: () => {
                router.reload({
                    only: ["products"],
                });

                toast.success("Product duplicated successfully.", {
                    description:
                        "A copy of the product has been created successfully.",
                });
            },

            onError: () => {
                toast.error("Unable to duplicate product.", {
                    description:
                        "There was an error while duplicating the product.",
                });
            },
        });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(products.destroy(deleteTarget.id).url, {
                preserveScroll: true,

                onSuccess: () => {
                    setProductsData(prev =>
                        prev.filter(p => p.id !== deleteTarget.id)
                    );

                    setDeleteOpen(false);
                    setDeleteTarget(null);

                    toast.success("Product deleted successfully.", {
                        description: "The product has been deleted successfully.",
                    });
                },
                onError: () => {
                    toast.error("Unable to delete product.", {
                        description: "There was an error while deleting the product.",
                    });
                }
            });

            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];

            ids.forEach(id => {
                router.delete(products.destroy(id).url, {
                    preserveScroll: true,
                });
            });

            setProductsData(prev =>
                prev.filter(p => !ids.includes(p.id))
            );

            setSelectedRows([]);
            setDeleteOpen(false);

            toast.success(`${ids.length} products deleted successfully.`, {
                description: "The selected products have been deleted successfully.",
            });
        }
    };

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [productsData, setProductsData] = useState(productList.data);

    useEffect(() => {
        setProductsData(productList.data);
    }, [productList.data]);
    const filteredProducts = useMemo(() => {
        let data = [...productsData];

        const keyword = search.trim().toLowerCase();

        if (keyword !== "") {
            data = data.filter((product) =>
                [
                    product.name,
                    product.sku,
                    product.supplier,
                    product.category,
                    product.barcode ?? "",
                    product.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(keyword)
            );
        }

        switch (statusFilter) {
            case "Delivered":
                data = data.filter(
                    (product) => product.status === "Delivered"
                );
                break;

            case "Pending":
                data = data.filter(
                    (product) => product.status === "Pending"
                );
                break;

            case "Low Stock":
                data = data.filter(
                    (product) => product.quantity <= product.minimum_stock
                );
                break;
        }

        return data;
    }, [productsData, search, statusFilter]);
    return (
        <>
            <Head title="Products" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Products
                        </h1>

                        <p className="text-muted-foreground">
                            Manage all inventory products.
                        </p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">

                   <CardHeader className="px-6 py-5">
                        <ProductsToolbar
                            search={search}
                            setSearch={setSearch}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            selectedRows={selectedRows}
                            setEditingProduct={setEditingProduct}
                            setForm={setForm}
                            setOpen={setOpen}
                            setBulkDelete={setBulkDelete}
                            setDeleteTarget={setDeleteTarget}
                            setDeleteOpen={setDeleteOpen}
                            archiveSelected={archiveSelected}
                        />
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex flex-col overflow-hidden">
                        <ProductsTable
                            products={filteredProducts}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            setSelectedProduct={setSelectedProduct}
                            setViewOpen={setViewOpen}
                            setEditingProduct={setEditingProduct}
                            setForm={setForm}
                            setOpen={setOpen}
                            setBulkDelete={setBulkDelete}
                            setDeleteTarget={setDeleteTarget}
                            setDeleteOpen={setDeleteOpen}
                            setStatusProduct={setStatusProduct}
                            setNewStatus={setNewStatus}
                            setStatusOpen={setStatusOpen}
                            getStatusColor={getStatusColor}
                            archiveProduct={archiveProduct}
                            duplicateProduct={duplicateProduct}
                        />
                    </CardContent>
                </Card>
            <ProductsPagination
                productList={productList}
            />
            </div>
            <ProductViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                product={selectedProduct}
                onEdit={() => {
                    if (!selectedProduct) return;

                    setViewOpen(false);

                    setEditingProduct(selectedProduct);

                    setForm({
                        sku: selectedProduct.sku,
                        barcode: selectedProduct.barcode ?? "",
                        name: selectedProduct.name,
                        supplier: selectedProduct.supplier,
                        category: selectedProduct.category,
                        unit: selectedProduct.unit,
                        quantity: selectedProduct.quantity,
                        minimum_stock: selectedProduct.minimum_stock,
                        cost_price: selectedProduct.cost_price,
                        selling_price: selectedProduct.selling_price,
                        status: selectedProduct.status,
                        description: selectedProduct.description ?? "",
                        archived: selectedProduct.archived,
                    });

                    setOpen(true);
                }}
            />
           <ProductDialog
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);

                    if (!value) {
                        setEditingProduct(null);
                    }
                }}
                form={form}
                setForm={setForm}
                onSave={saveProduct}
                categories={categories}
                editing={editingProduct !== null}
            />
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>

                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Delete Product
                        </DialogTitle>

                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.name}"?`
                                : `Delete ${selectedRows.length} selected products?`}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>

                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={statusOpen}
                onOpenChange={setStatusOpen}
            >
                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Change Product Status
                        </DialogTitle>

                        <DialogDescription>

                            Change

                            <strong>
                                {" "}
                                {statusProduct?.name}
                                {" "}
                            </strong>

                            to

                            <strong>
                                {" "}
                                {newStatus}
                            </strong>

                            ?

                        </DialogDescription>

                    </DialogHeader>

                    <DialogFooter>

                        <DialogClose asChild>

                            <Button variant="outline">
                                Cancel
                            </Button>

                        </DialogClose>

                        <Button

                            onClick={() => {

                                if (!statusProduct) return;

                                router.patch(
                                    products.status(statusProduct.id).url,
                                    {
                                        status: newStatus,
                                    },
                                    {
                                        preserveScroll: true,

                                        onSuccess: () => {

                                            setStatusOpen(false);

                                            router.reload({
                                                only: ["products"],
                                            });

                                        },
                                    }
                                );

                            }}

                        >

                            Confirm

                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>
        </>
        
    ); 
}


Products.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: "/products",
        },
    ],
};