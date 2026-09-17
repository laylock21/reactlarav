import { Eye, RotateCcw, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { ArchivedProduct } from "./archived-types";

type ArchivedTableProps = {
    products: ArchivedProduct[];

    selectedRows: number[];

    allSelected: boolean;

    toggleRowSelection: (
        productId: number,
        checked: boolean
    ) => void;

    toggleSelectAll: () => void;

    onView: (product: ArchivedProduct) => void;

    onRestore: (product: ArchivedProduct) => void;

    onDelete: (product: ArchivedProduct) => void;
};

export function ArchivedTable({
    products,
    selectedRows,
    allSelected,
    toggleRowSelection,
    toggleSelectAll,
    onView,
    onRestore,
    onDelete,
}: ArchivedTableProps) {

    return (
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border">

            <div className="h-full overflow-auto">

                <table className="w-full">

                    {/* Header */}

                    <thead className="sticky top-0 z-20 bg-background">

                        <tr className="border-b">

                            <th className="w-12 p-3 text-left">

                                <Checkbox
                                    checked={
                                        products.length > 0 &&
                                        allSelected
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />

                            </th>

                            <th className="p-3 text-left">
                                SKU
                            </th>

                            <th className="p-3 text-left">
                                Product
                            </th>

                            <th className="p-3 text-left">
                                Supplier
                            </th>

                            <th className="p-3 text-left">
                                Category
                            </th>

                            <th className="p-3 text-left">
                                Stock
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Archived
                            </th>

                            <th className="p-3 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    {/* Body */}

                    <tbody>

                        {products.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={9}
                                    className="
                                        p-10
                                        text-center
                                        text-muted-foreground
                                    "
                                >
                                    No archived products found.
                                </td>

                            </tr>

                        ) : (

                            products.map((product) => (

                                <tr
                                    key={product.id}
                                    className="
                                        border-b
                                        transition-colors
                                        hover:bg-muted/40
                                    "
                                >

                                    {/* Checkbox */}

                                    <td className="p-3">

                                        <Checkbox
                                            checked={selectedRows.includes(
                                                product.id
                                            )}
                                            onCheckedChange={(checked) =>
                                                toggleRowSelection(
                                                    product.id,
                                                    Boolean(checked)
                                                )
                                            }
                                        />

                                    </td>

                                    {/* SKU */}

                                    <td className="p-3">

                                        <Badge variant="secondary">
                                            {product.sku}
                                        </Badge>

                                    </td>

                                    {/* Product */}

                                    <td className="p-3 font-medium">
                                        {product.name}
                                    </td>

                                    {/* Supplier */}

                                    <td className="p-3">
                                        {product.supplier}
                                    </td>

                                    {/* Category */}

                                    <td className="p-3">
                                        {product.category}
                                    </td>

                                    {/* Stock */}

                                    <td className="p-3">
                                        {product.quantity}
                                    </td>

                                    {/* Status */}

                                    <td className="p-3">

                                        <Badge variant="secondary">
                                            Archived
                                        </Badge>

                                    </td>

                                    {/* Archived Date */}

                                    <td className="p-3 whitespace-nowrap">

                                        {product.updated_at
                                            ? new Date(
                                                product.updated_at
                                            ).toLocaleDateString()
                                            : "—"}

                                    </td>

                                    {/* Actions */}

                                    <td className="p-3">

                                        <div className="flex items-center gap-1">

                                            {/* View */}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onView(product)
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />

                                                View
                                            </Button>

                                            {/* Restore */}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onRestore(product)
                                                }
                                            >
                                                <RotateCcw className="mr-2 h-4 w-4" />

                                                Restore
                                            </Button>

                                            {/* Delete */}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() =>
                                                    onDelete(product)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />

                                                Delete
                                            </Button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}