import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreVertical,
    Pencil,
    Eye,
    Copy,
    Archive,
    Trash2,
} from "lucide-react";

import type { Product } from "@/types/product";

import type { ProductForm } from "./products-types";

type Props = {
    products: Product[];

    selectedRows: number[];

    setSelectedRows: React.Dispatch<
        React.SetStateAction<number[]>
    >;

    setSelectedProduct: React.Dispatch<
        React.SetStateAction<Product | null>
    >;

    setViewOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setEditingProduct: React.Dispatch<
        React.SetStateAction<Product | null>
    >;

    setForm: React.Dispatch<
        React.SetStateAction<ProductForm>
    >;

    setOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setBulkDelete: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setDeleteTarget: React.Dispatch<
        React.SetStateAction<Product | null>
    >;

    setDeleteOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setStatusProduct: React.Dispatch<
        React.SetStateAction<Product | null>
    >;

    setNewStatus: React.Dispatch<
        React.SetStateAction<string>
    >;

    setStatusOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    getStatusColor: (status: string) => string;
};

export function ProductsTable({
    products,
    selectedRows,
    setSelectedRows,
    setSelectedProduct,
    setViewOpen,
    setEditingProduct,
    setForm,
    setOpen,
    setBulkDelete,
    setDeleteTarget,
    setDeleteOpen,
    setStatusProduct,
    setNewStatus,
    setStatusOpen,
    getStatusColor,
}: Props) {
    const allSelected =
        products.length > 0 &&
        selectedRows.length === products.length;

    const handleSelectAll = (
        checked: boolean | "indeterminate"
    ) => {
        if (checked) {
            setSelectedRows(
                products.map((product) => product.id)
            );
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectProduct = (
        checked: boolean | "indeterminate",
        productId: number
    ) => {
        if (checked) {
            setSelectedRows((prev) => [
                ...prev,
                productId,
            ]);

            return;
        }

        setSelectedRows((prev) =>
            prev.filter((id) => id !== productId)
        );
    };

    return (
        <div className="overflow-x-auto h-full">
            <div className="flex-1 min-w-full overflow-y-auto">
                <Table>

                    {/* TABLE HEADER */}

                    <TableHeader className="sticky top-0 bg-background z-10">

                        <TableRow className="border-b last:border-0">

                            {/* SELECT ALL */}

                            <TableHead className="w-12">

                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={
                                        handleSelectAll
                                    }
                                />

                            </TableHead>

                            {/* ACTION */}

                            <TableHead className="w-12" />

                            <TableHead>
                                SKU
                            </TableHead>

                            <TableHead>
                                Supplier
                            </TableHead>

                            <TableHead>
                                Product
                            </TableHead>

                            <TableHead>
                                Category
                            </TableHead>

                            <TableHead>
                                Stock
                            </TableHead>

                            <TableHead>
                                Status
                            </TableHead>

                            <TableHead>
                                Ordered
                            </TableHead>

                            <TableHead className="text-right">
                                Price
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    {/* TABLE BODY */}

                    <TableBody>

                        {products.map((product) => (

                            <TableRow
                                key={product.id}
                                className="border-b border-slate-200 dark:border-slate-800"
                            >

                                {/* CHECKBOX */}

                                <TableCell>

                                    <Checkbox
                                        checked={selectedRows.includes(
                                            product.id
                                        )}
                                        onCheckedChange={(
                                            checked
                                        ) =>
                                            handleSelectProduct(
                                                checked,
                                                product.id
                                            )
                                        }
                                    />

                                </TableCell>

                                {/* ACTION MENU */}

                                <TableCell>

                                    <DropdownMenu>

                                        <DropdownMenuTrigger
                                            asChild
                                        >

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

                                            {/* VIEW */}

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    setSelectedProduct(
                                                        product
                                                    );

                                                    setViewOpen(
                                                        true
                                                    );

                                                }}
                                            >

                                                <Eye className="mr-2 h-4 w-4" />

                                                View Details

                                            </DropdownMenuItem>

                                            {/* EDIT */}

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    setEditingProduct(
                                                        product
                                                    );

                                                    setForm({
                                                        sku:
                                                            product.sku,

                                                        barcode:
                                                            product.barcode ??
                                                            "",

                                                        name:
                                                            product.name,

                                                        supplier:
                                                            product.supplier,

                                                        category:
                                                            product.category,

                                                        unit:
                                                            product.unit,

                                                        quantity:
                                                            product.quantity,

                                                        minimum_stock:
                                                            product.minimum_stock,

                                                        cost_price:
                                                            product.cost_price,

                                                        selling_price:
                                                            product.selling_price,

                                                        status:
                                                            product.status,

                                                        description:
                                                            product.description ??
                                                            "",

                                                        archived:
                                                            product.archived,
                                                    });

                                                    setOpen(true);

                                                }}
                                            >

                                                <Pencil className="mr-2 h-4 w-4" />

                                                Edit Product

                                            </DropdownMenuItem>

                                            {/* DUPLICATE */}

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    router.post(
                                                        `/products/${product.id}/duplicate`,
                                                        {},
                                                        {
                                                            preserveScroll:
                                                                true,

                                                            onSuccess:
                                                                () => {

                                                                    router.reload(
                                                                        {
                                                                            only: [
                                                                                "products",
                                                                            ],
                                                                        }
                                                                    );

                                                                },
                                                        }
                                                    );

                                                }}
                                            >

                                                <Copy className="mr-2 h-4 w-4" />

                                                Duplicate

                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            {/* ARCHIVE */}

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    router.patch(
                                                        `/products/${product.id}/archive`,
                                                        {},
                                                        {
                                                            preserveScroll:
                                                                true,

                                                            onSuccess:
                                                                () => {

                                                                    router.reload(
                                                                        {
                                                                            only: [
                                                                                "products",
                                                                            ],
                                                                        }
                                                                    );

                                                                },
                                                        }
                                                    );

                                                }}
                                            >

                                                <Archive className="mr-2 h-4 w-4" />

                                                Archive

                                            </DropdownMenuItem>

                                            {/* DELETE */}

                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => {

                                                    setBulkDelete(
                                                        false
                                                    );

                                                    setDeleteTarget(
                                                        product
                                                    );

                                                    setDeleteOpen(
                                                        true
                                                    );

                                                }}
                                            >

                                                <Trash2 className="mr-2 h-4 w-4" />

                                                Delete

                                            </DropdownMenuItem>

                                        </DropdownMenuContent>

                                    </DropdownMenu>

                                </TableCell>

                                {/* SKU */}

                                <TableCell>
                                    {product.sku}
                                </TableCell>

                                {/* SUPPLIER */}

                                <TableCell>
                                    {product.supplier}
                                </TableCell>

                                {/* PRODUCT */}

                                <TableCell className="font-medium">
                                    {product.name}
                                </TableCell>

                                {/* CATEGORY */}

                                <TableCell>
                                    {product.category}
                                </TableCell>

                                {/* STOCK */}

                                <TableCell>
                                    {product.quantity}
                                </TableCell>

                                {/* STATUS */}

                                <TableCell>

                                    <DropdownMenu>

                                        <DropdownMenuTrigger
                                            asChild
                                        >

                                            <button>
                                                <Badge
                                                    className={getStatusColor(
                                                        product.status
                                                    )}
                                                >
                                                    {product.status}
                                                </Badge>
                                            </button>

                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    setStatusProduct(
                                                        product
                                                    );

                                                    setNewStatus(
                                                        "Pending"
                                                    );

                                                    setStatusOpen(
                                                        true
                                                    );

                                                }}
                                            >
                                                Pending
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    setStatusProduct(
                                                        product
                                                    );

                                                    setNewStatus(
                                                        "Delivered"
                                                    );

                                                    setStatusOpen(
                                                        true
                                                    );

                                                }}
                                            >
                                                Delivered
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => {

                                                    setStatusProduct(
                                                        product
                                                    );

                                                    setNewStatus(
                                                        "In Transit"
                                                    );

                                                    setStatusOpen(
                                                        true
                                                    );

                                                }}
                                            >
                                                In Transit
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>

                                    </DropdownMenu>

                                </TableCell>

                                {/* ORDERED */}

                                <TableCell>
                                    {new Date(
                                        product.created_at
                                    ).toLocaleDateString()}
                                </TableCell>

                                {/* PRICE */}

                                <TableCell className="text-right">
                                    ₱
                                    {Number(
                                        product.selling_price
                                    ).toLocaleString()}
                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>
            </div>
        </div>
    );
}