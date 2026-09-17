import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import StockMovementStats from "@/components/products/stock-movement/stock-movement-stats";
import { StockMovementTable } from "@/components/products/stock-movement/stock-movement-table";
import { StockMovementToolbar } from "@/components/products/stock-movement/stock-movement-toolbar";
import { ProductViewDialog } from "@/components/products/partials/product-view-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Movement } from "@/components/products/stock-movement/types";
import { StockMovementViewDialog } from "@/components/products/stock-movement/partials/stock-movement-view-dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Filter,
    Search,
    History,
    ArrowLeft,
    RotateCcw,
} from "lucide-react";
import { Product } from "@/types/product";

type ProductSnapshot = {
    sku?: string;
    barcode?: string;
    name?: string;
    supplier?: string;
    category?: string;
    unit?: string;
    quantity?: number;
    minimum_stock?: number;
    cost_price?: number;
    selling_price?: number;
    status?: string;
    description?: string;
};

type Props = {
    movements: {
        data: Movement[];

        current_page: number;
        last_page: number;
        per_page: number;
        total: number;

        from: number | null;
        to: number | null;

        prev_page_url: string | null;
        next_page_url: string | null;

        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };

    filters: {
        search?: string;
    };

    product?: {
        id: number;
        name: string;
    } | null;
};

export default function StockMovement({
    movements,
    filters,
    product,
}: Props) {

    const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [selectedMovement, setSelectedMovement] =
        useState<Movement | null>(null);
    const [showPrevious, setShowPrevious] = 
        useState<Record<string, boolean>>({});

    const [viewOpen, setViewOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [revertOpen, setRevertOpen] = useState(false);

    const [filter, setFilter] = useState<
        | "all"
        | "CREATED"
        | "EDITED"
        | "ARCHIVED"
        | "DUPLICATED"
        | "STOCK_IN"
        | "STOCK_OUT"
        | "STOCK_ADJUSTMENT"
    >("all");

    const filteredMovements =
    filter === "all"
        ? movements.data
        : movements.data.filter(
              movement => movement.type === filter
          );
    
    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

        }, 300);

        return () => clearTimeout(timer);

    }, [search]);

    useEffect(() => {

        router.get(
            "/stock-movement",
            {
                search: debouncedSearch,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );

    }, [debouncedSearch]);

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

    const editableMovements = filteredMovements.filter(
        (movement) => movement.type === "EDITED"
    );

    const allEditedSelected =
        editableMovements.length > 0 &&
        selectedRows.length === editableMovements.length;

    const toggleRowSelection = (
        checked: boolean | "indeterminate",
        movementId: number
    ) => {
        if (checked) {
            setSelectedRows((prev) => [...new Set([...prev, movementId])]);
            return;
        }

        setSelectedRows((prev) => prev.filter((id) => id !== movementId));
    };

    const toggleSelectAllEdited = () => {
        if (allEditedSelected) {
            setSelectedRows([]);
            return;
        }

        setSelectedRows(editableMovements.map((movement) => movement.id));
    };

    const revertMovements = (ids: number[]) => {
        if (ids.length === 0) {
            return;
        }

        router.patch(
            "/stock-movement/revert",
            { ids },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
                    setRevertOpen(false);
                },
            }
        );
    };

    const handleRevertSelected = () => revertMovements(selectedRows);

    const handleRevertMovement = (movementId: number) => revertMovements([movementId]);

    return (
        <>
            <Head title="Stock Movement" />

            <div className="flex h-full min-h-0 flex-col space-y-4 p-6 overflow-hidden">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">
                            {product
                                ? `${product.name} History`
                                : "Stock Movement"}
                        </h1>

                        <p className="text-muted-foreground">
                            {product
                                ? "Complete history of this product."
                                : "Complete inventory ledger and transaction history."}
                        </p>

                    </div>

                    {product && (

                        <Button
                            asChild
                            variant="outline"
                        >

                            <Link href="/stock-movement">

                                <ArrowLeft className="mr-2 h-4 w-4"/>

                                Back to Ledger

                            </Link>

                        </Button>

                    )}

                </div>

                {/* Statistics */}

                <StockMovementStats
                    movements={movements.data}
                />

                <Card className="flex flex-col overflow-hidden">

                    <CardHeader className="px-6 py-3">

                        <StockMovementToolbar
                            search={search}
                            setSearch={setSearch}
                            filter={filter}
                            setFilter={setFilter}
                            selectedRows={selectedRows}
                            onRevertSelected={() => setRevertOpen(true)}
                        />

                    </CardHeader>

                    <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">

                        {/* TABLE AREA */}
                        <div className="min-h-0 flex-1 overflow-hidden">
                            <StockMovementTable
                                movements={filteredMovements}
                                selectedRows={selectedRows}
                                allEditedSelected={allEditedSelected}
                                toggleRowSelection={toggleRowSelection}
                                toggleSelectAllEdited={toggleSelectAllEdited}
                                setSelectedMovement={setSelectedMovement}
                                setSelectedProduct={setSelectedProduct}
                                setShowPrevious={setShowPrevious}
                                setViewOpen={setViewOpen}
                            />
                        </div>
                    </CardContent>

                </Card>

            </div>

            <StockMovementViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                movement={selectedMovement}
                showPrevious={showPrevious}
                setShowPrevious={setShowPrevious}
                onRevert={
                    selectedMovement
                        ? () => handleRevertMovement(selectedMovement.id)
                        : undefined
                }
            />

            <ProductViewDialog
                open={selectedProduct !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedProduct(null);
                    }
                }}
                product={selectedProduct}
            />

            <Dialog open={revertOpen} onOpenChange={setRevertOpen}>
                <DialogContent>
                    <DialogTitle>Revert selected edits?</DialogTitle>
                    <DialogDescription>
                        This will restore all selected edited records to their original values. This action cannot be undone.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                variant="destructive"
                                onClick={handleRevertSelected}
                                disabled={selectedRows.length === 0}
                            >
                                Revert selected
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}
