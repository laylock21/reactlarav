import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
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

import { useMemo, useState } from "react";
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
import type { Product } from "@/types/product";



type Props = {
    products: {
        data: Product[];
    };
};

export default function Products({ products }: Props) {

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
    };

const [form, setForm] = useState(emptyForm);
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
            router.put(
                route("products.update", editingProduct.id),
                form,
                {
                    onSuccess: () => {
                        setOpen(false);
                        setEditingProduct(null);
                        setForm(emptyForm);
                    },
                }
            );
        } else {
            router.post(
                route("products.store"),
                form,
                {
                    onSuccess: () => {
                        setOpen(false);
                        setForm(emptyForm);
                    },
                }
            );
        }
    };

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const filteredProducts = useMemo(() => {
        let data = [...products.data];
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
    }, [search, statusFilter]);
    return (
        <>
            <Head title="Products" />

            <div className="space-y-6 p-6">

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
                <Card>

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
                                    onClick={() => {
                                        alert(
                                            `Delete ${selectedRows.length} selected products`
                                        );
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

                    <CardContent className="px-8 pb-6 overflow-x-auto">

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
                                                        });

                                                        setOpen(true);
                                                    }}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Product
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.get(route("products.movements", product.id))
                                                    }
                                                >
                                                    <Package className="mr-2 h-4 w-4" />
                                                    Stock Movement
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.post(route("products.duplicate", product.id))
                                                    }
                                                >
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplicate
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.patch(route("products.status", product.id))
                                                    }
                                                >
                                                    <BadgeCheck className="mr-2 h-4 w-4" />
                                                    Change Status
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.patch(route("products.archive", product.id))
                                                    }
                                                >
                                                    <Archive className="mr-2 h-4 w-4" />
                                                    Archive
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => {
                                                        if (confirm(`Delete ${product.name}?`)) {
                                                            router.delete(`/products/${product.id}`);
                                                        }
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

                    </CardContent>

                </Card>
            </div>
            <ProductViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                product={selectedProduct}
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
            />
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