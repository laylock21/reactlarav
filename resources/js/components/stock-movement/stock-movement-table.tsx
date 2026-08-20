import { Link } from "@inertiajs/react";
import {
    Eye,
    Plus,
    Pencil,
    Copy,
    Archive,
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowUpDown,
    ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/types/product";

import type { Movement } from "@/components/stock-movement/types";

type StockMovementTableProps = {
    movements: Movement[];

    selectedRows: number[];

    allEditedSelected: boolean;

    setSelectedProduct: (product: Product) => void;

    toggleRowSelection: (
        checked: boolean | "indeterminate",
        movementId: number
    ) => void;

    toggleSelectAllEdited: () => void;

    setSelectedMovement: (movement: Movement) => void;

    setShowPrevious: (
        value: Record<string, boolean>
    ) => void;

    setViewOpen: (value: boolean) => void;
};

export function StockMovementTable({
    movements,
    selectedRows,
    allEditedSelected,
    toggleRowSelection,
    toggleSelectAllEdited,
    setSelectedMovement,
    setSelectedProduct,
    setShowPrevious,
    setViewOpen,
}: StockMovementTableProps) {

    const badgeColor = (type: string) => {
        switch (type) {
            case "CREATED":
                return "bg-green-600";

            case "EDITED":
                return "bg-yellow-500";

            case "ARCHIVED":
                return "bg-gray-600";

            case "DUPLICATED":
                return "bg-violet-600";

            case "STOCK_IN":
                return "bg-blue-600";

            case "STOCK_OUT":
                return "bg-red-600";

            case "STOCK_ADJUSTMENT":
                return "bg-orange-500";

            default:
                return "";
        }
    };

    const prettyAction = (type: string) =>
        type.replaceAll("_", " ");

    return (
        <div className="min-h-0 flex-1 rounded-lg border overflow-hidden">

            <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-lg border">

                <table className="w-full">

                    <thead className="sticky top-0 bg-background z-20">

                        <tr>

                            <th className="p-3 text-left w-12">
                                <Checkbox
                                    checked={allEditedSelected}
                                    onCheckedChange={
                                        toggleSelectAllEdited
                                    }
                                    disabled={movements.filter(
                                        (movement) =>
                                            movement.type === "EDITED"
                                    ).length === 0}
                                />
                            </th>

                            <th className="px-3 py-2 text-left">
                                Product
                            </th>

                            <th className="px-3 py-2 text-left">
                                View
                            </th>

                            <th className="px-3 py-2 text-left">
                                Action
                            </th>

                            <th className="px-3 py-2 text-left">
                                Change
                            </th>

                            <th className="px-3 py-2 text-left">
                                Before
                            </th>

                            <th className="px-3 py-2 text-left">
                                After
                            </th>

                            <th className="px-3 py-2 text-left">
                                User
                            </th>

                            <th className="px-3 py-2 text-left">
                                Date
                            </th>

                            <th className="px-3 py-2 text-left">
                                Remarks
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {movements.map((movement) => (

                            <tr
                                key={movement.id}
                                className="border-t transition-colors hover:bg-muted/40"
                            >

                                {/* Checkbox */}

                                <td className="px-3 py-2">

                                    <Checkbox
                                        checked={selectedRows.includes(
                                            movement.id
                                        )}
                                        disabled={
                                            movement.type !== "EDITED"
                                        }
                                        onCheckedChange={(value) =>
                                            toggleRowSelection(
                                                Boolean(value),
                                                movement.id
                                            )
                                        }
                                    />

                                </td>

                                {/* Product */}

                                <td className="px-3 py-2">

                                    <button
                                        type="button"
                                        className="group text-left"
                                        onClick={() => {
                                            setSelectedProduct(movement.product as Product);
                                        }}
                                    >

                                        <div className="space-y-1">

                                            <p className="font-medium transition-colors group-hover:text-primary group-hover:underline">
                                                {movement.product.name}
                                            </p>

                                            <Badge variant="secondary">
                                                {movement.product.sku}
                                            </Badge>

                                        </div>

                                    </button>

                                </td>

                                {/* View */}

                                <td className="px-3 py-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {

                                            setSelectedMovement(
                                                movement
                                            );

                                            setShowPrevious({});

                                            setViewOpen(true);

                                        }}
                                    >

                                        <Eye className="mr-2 h-4 w-4" />

                                        View Details

                                    </Button>

                                </td>

                                {/* Action */}

                                <td className="px-3 py-2">

                                    <Badge
                                        className={badgeColor(
                                            movement.type
                                        )}
                                    >

                                        {movement.type === "CREATED" && (
                                            <Plus className="mr-1 h-3 w-3" />
                                        )}

                                        {movement.type === "EDITED" && (
                                            <Pencil className="mr-1 h-3 w-3" />
                                        )}

                                        {movement.type === "DUPLICATED" && (
                                            <Copy className="mr-1 h-3 w-3" />
                                        )}

                                        {movement.type === "ARCHIVED" && (
                                            <Archive className="mr-1 h-3 w-3" />
                                        )}

                                        {movement.type === "STOCK_IN" && (
                                            <ArrowDownToLine className="mr-1 h-3 w-3" />
                                        )}

                                        {movement.type === "STOCK_OUT" && (
                                            <ArrowUpFromLine className="mr-1 h-3 w-3" />
                                        )}

                                        {prettyAction(movement.type)}

                                    </Badge>

                                </td>

                                {/* Quantity */}

                                <td className="p-3 font-semibold">

                                    {movement.type === "STOCK_IN" && (
                                        <span className="text-green-600">
                                            +{movement.quantity}
                                        </span>
                                    )}

                                    {movement.type === "STOCK_OUT" && (
                                        <span className="text-red-600">
                                            -{movement.quantity}
                                        </span>
                                    )}

                                    {movement.type !== "STOCK_IN" &&
                                        movement.type !== "STOCK_OUT" &&
                                        movement.type !== "STOCK_ADJUSTMENT" && (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}

                                    {movement.type === "STOCK_ADJUSTMENT" && (
                                        <ArrowUpDown className="mr-1 h-3 w-3" />
                                    )}

                                </td>

                                {/* Before */}

                                <td className="p-3 text-muted-foreground">
                                    {movement.before_quantity}
                                </td>

                                {/* After */}

                                <td className="p-3 font-semibold">
                                    {movement.after_quantity}
                                </td>

                                {/* User */}

                                <td className="px-3 py-2">
                                    {movement.user?.name ?? "System"}
                                </td>

                                {/* Date */}

                                <td className="p-3 whitespace-nowrap">

                                    {new Date(
                                        movement.created_at
                                    ).toLocaleString()}

                                </td>

                                {/* Remarks */}

                                <td className="p-3 max-w-xs">
                                    {movement.remarks ?? "—"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}