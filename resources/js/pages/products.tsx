import { Head, router } from "@inertiajs/react";
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

import { ProductDialog } from "@/components/product-dialog";

import { useEffect, useMemo, useState } from "react";
import { ProductViewDialog } from "@/components/product-view-dialog";


import {
    Search,
    Filter,
    Upload,
    Trash2,
    Plus,
    MoreVertical,
    Pencil,
    Eye,
    Copy,
    Package,
    Archive,
    BadgeCheck,
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

type Props = {
    products: {
        data: Product[];

        current_page: number;

        last_page: number;

        prev_page_url: string | null;

        next_page_url: string | null;
    };
};

export default function Products({ products: productList }: Props) {
    const [search, setSearch] = useState("");
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

type ProductForm = Omit<Product, "id" | "created_at" | "updated_at">;

const [form, setForm] = useState<ProductForm>(emptyForm);
    const [statusFilter, setStatusFilter] = useState<
        "all" | "Delivered" | "Pending" | "Low Stock"
    >("all");

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
                },
            });
        } else {
            router.post(products.store().url, form, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setOpen(false);
                    setForm(emptyForm);
                },
            });
        }
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
                },
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
        // Search
        data = data.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase()) ||
            product.supplier.toLowerCase().includes(search.toLowerCase())
        );

        // Status filter
        if (statusFilter === "Delivered") {
            data = data.filter(product => product.status === "Delivered");
        }

        if (statusFilter === "Pending") {
            data = data.filter(product => product.status === "Pending");
        }

        if (statusFilter === "Low Stock") {
            data = data.filter(product => product.quantity <= 10);
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
                        <div className="flex items-center justify-between gap-4">

                            {/* Left Side */}
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    placeholder="Search products..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-2">

                                {/* Filter */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                                            All Products
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setStatusFilter("Delivered")}>
                                            Delivered
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                                            Pending
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setStatusFilter("Low Stock")}>
                                            Low Stock
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Import */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => console.log("Export CSV")}
                                        >
                                            CSV
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => console.log("Export PDF")}
                                        >
                                            PDF
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Delete */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => {
                                        setBulkDelete(true);
                                        setDeleteTarget(null);
                                        setDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>   

                                {/* Add Product */}
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setForm(emptyForm);
                                        setOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>

                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-6 flex flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>

                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">

                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={
                                                        filteredProducts.length > 0 &&
                                                        selectedRows.length === filteredProducts.length
                                                    }
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedRows(filteredProducts.map((p) => p.id));
                                                        } else {
                                                            setSelectedRows([]);
                                                        }
                                                    }}
                                                />
                                            </TableHead>

                                            <TableHead className="w-12"></TableHead>

                                            <TableHead>SKU</TableHead>

                                            <TableHead>Supplier</TableHead>
                
                                            <TableHead>Product</TableHead>

                                            <TableHead>Category</TableHead>

                                            <TableHead>Stock</TableHead>

                                            <TableHead>Status</TableHead>

                                            <TableHead>Ordered</TableHead>

                                            <TableHead className="text-right">
                                                Price
                                            </TableHead>


                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>

                                        {filteredProducts.map((product) => (

                                            <TableRow
                                                key={product.id}
                                                className="border-b border-slate-200 dark:border-slate-800"
                                            >
                                                
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(product.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedRows([...selectedRows, product.id]);
                                                            } else {
                                                                setSelectedRows(
                                                                    selectedRows.filter((id) => id !== product.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>

                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent
                                                            align="start"
                                                            sideOffset={8}
                                                            className="w-56"
                                                        >

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setViewOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditingProduct(product);

                                                                setForm({
                                                                    sku: product.sku,
                                                                    barcode: product.barcode ?? "",
                                                                    name: product.name,
                                                                    supplier: product.supplier,
                                                                    category: product.category,
                                                                    unit: product.unit,
                                                                    quantity: product.quantity,
                                                                    minimum_stock: product.minimum_stock,
                                                                    cost_price: product.cost_price,
                                                                    selling_price: product.selling_price,
                                                                    status: product.status,
                                                                    description: product.description ?? "",
                                                                    archived: product.archived,
                                                                });

                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Product
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                router.get(products.movements(product.id).url);
                                                            }}
                                                        >
                                                            <Package className="mr-2 h-4 w-4" />
                                                            Stock Movement
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                router.post(products.duplicate(product.id).url);
                                                            }}
                                                        >
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Duplicate
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                router.patch(products.status(product.id).url);
                                                            }}
                                                        >
                                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                                            Change Status
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                router.patch(products.archive(product.id).url);
                                                            }}
                                                        >
                                                            <Archive className="mr-2 h-4 w-4" />
                                                            Archive
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setBulkDelete(false);
                                                                setDeleteTarget(product);
                                                                setDeleteOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>

                                                    </DropdownMenuContent>

                                                    </DropdownMenu>
                                                </TableCell>

                                                <TableCell>{product.sku}</TableCell>

                                                <TableCell>{product.supplier}</TableCell>

                                                <TableCell className="font-medium">
                                                    {product.name}
                                                </TableCell>

                                                <TableCell>{product.category}</TableCell>

                                                <TableCell>{product.quantity}</TableCell>

                                                <TableCell>
                                                <Badge className={getStatusColor(product.status)}>
                                                    {product.status}
                                                </Badge>
                                                </TableCell>

                                                <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>

                                                <TableCell className="text-right">
                                                    ₱{Number(product.selling_price).toLocaleString()}
                                                </TableCell>

                                            </TableRow>

                                        ))}

                                    </TableBody>

                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            <div className="mt-6 flex items-center justify-between">

                {/* LEFT - Page Size */}
                <div className="flex items-center gap-2">

                    <span className="text-sm text-muted-foreground">
                        Go to page
                    </span>

                    <select
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                        value={productList.current_page}
                        onChange={(e) =>
                            router.get(`/products?page=${e.target.value}`)
                        }
                    >
                        {Array.from(
                            { length: productList.last_page },
                            (_, i) => (
                                <option
                                    key={i + 1}
                                    value={i + 1}
                                >
                                    {i + 1}
                                </option>
                            )
                        )}
                    </select>

                </div>

                {/* CENTER - Pagination */}
                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        disabled={productList.current_page === 1}
                        onClick={() => router.get(productList.prev_page_url!)}
                    >
                        Previous
                    </Button>

                    {Array.from(
                        { length: Math.max(productList.last_page, 5) },
                        (_, i) => (
                            <Button
                                key={i}
                                variant={
                                    productList.current_page === i + 1
                                        ? "default"
                                        : "outline"
                                }
                                disabled={i + 1 > productList.last_page}
                                onClick={() =>
                                    router.get(`/products?page=${i + 1}`)
                                }
                            >
                                {i + 1}
                            </Button>
                        )
                    )}

                    <Button
                        variant="outline"
                        disabled={productList.current_page === productList.last_page}
                        onClick={() => router.get(productList.next_page_url!)}
                    >
                        Next
                    </Button>

                </div>

                {/* RIGHT - Page Indicator */}
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Page {productList.current_page} of {productList.last_page}
                </div>

            </div>
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