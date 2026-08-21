import { router } from "@inertiajs/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Search,
    Filter,
    Upload,
    Trash2,
    Plus,
    Archive,
} from "lucide-react";

import type {
    ProductStatus,
    ProductForm,
} from "./products-types";

import type { Product } from "@/types/product";

type Props = {
    search: string;
    setSearch: (value: string) => void;

    statusFilter: ProductStatus;
    setStatusFilter: (value: ProductStatus) => void;

    selectedRows: number[];

    setEditingProduct: (product: Product | null) => void;
    setForm: (form: ProductForm) => void;
    setOpen: (open: boolean) => void;

    setBulkDelete: (value: boolean) => void;
    setDeleteTarget: (product: Product | null) => void;
    setDeleteOpen: (open: boolean) => void;
    archiveSelected: () => void;
};

export function ProductsToolbar({
    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    selectedRows,

    setEditingProduct,
    setForm,
    setOpen,

    setBulkDelete,
    setDeleteTarget,
    setDeleteOpen,
    archiveSelected,

}: Props) {
    const emptyForm: ProductForm = {
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

    return (
        <div className="flex items-center justify-between gap-4">

            {/* Search */}
            <div className="relative max-w-sm w-full">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    placeholder="Search products..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;

                        setSearch(value);

                        router.get(
                            "/products",
                            {
                                search: value,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            }
                        );
                    }}
                />

            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

                {/* Filter */}
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button variant="outline">

                            <Filter className="mr-2 h-4 w-4" />

                            Filter

                        </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            onClick={() =>
                                setStatusFilter("all")
                            }
                        >
                            All Products
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                setStatusFilter("Delivered")
                            }
                        >
                            Delivered
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                setStatusFilter("Pending")
                            }
                        >
                            Pending
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                setStatusFilter("Low Stock")
                            }
                        >
                            Low Stock
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

                {/* Export */}
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button variant="outline">

                            <Upload className="mr-2 h-4 w-4" />

                            Export

                        </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            onClick={() => {
                                toast.success(
                                    "Preparing CSV export..."
                                );

                                window.location.href =
                                    "/products/export/csv";
                            }}
                        >
                            CSV
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => {
                                toast.success(
                                    "Preparing PDF export..."
                                );

                                window.location.href =
                                    "/products/export/pdf";
                            }}
                        >
                            PDF
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

                {/* Archive */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedRows.length === 0}
                    onClick={archiveSelected}
                    className="transition-colors duration-300 ease-out"
                >
                    <Archive
                        className={`mr-2 h-4 w-4 transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-orange-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    />

                    <span
                        className={`transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-orange-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    >
                        Archive
                    </span>
                </Button>

                {/* Delete */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                        setBulkDelete(true);
                        setDeleteTarget(null);
                        setDeleteOpen(true);
                    }}
                    className="transition-colors duration-300 ease-out"
                >

                    <Trash2
                        className={`mr-2 h-4 w-4 transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-red-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    />

                    <span
                        className={`transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-red-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    >
                        Delete
                    </span>

                </Button>

                {/* Add Product */}
                <Button
                    onClick={() => {
                        setEditingProduct(null);
                        setForm(emptyForm);
                        setOpen(true);
                    }}
                >

                    <Plus className="mr-2 h-4 w-4" />

                    Add Product

                </Button>

            </div>

        </div>
    );
}