import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

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


import { StockMovementViewDialog } from "@/components/stock-movement-view-dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Search,
    Filter,
    History,
    ArrowDownToLine,
    ArrowUpFromLine,
    Pencil,
    Archive,
    Package,
    Copy,
    Plus,
    ArrowLeft,
    Eye,
    ArrowRight,
    ArrowUpDown,
    RotateCcw,
} from "lucide-react";


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

type Movement = {
    id: number;
    type: string;
    quantity: number;
    before_quantity: number;
    after_quantity: number;
    remarks: string | null;
    created_at: string;

    before_data?: ProductSnapshot | null;
    after_data?: ProductSnapshot | null;

    filters: {
        search?: string;
    };

    product: {
        id: number;
        name: string;
        sku: string;
    };

    user: {
        name: string;
    } | null;
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

            <div className="flex h-full flex-col space-y-6 p-6 overflow-hidden">

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

                <div className="grid gap-4 md:grid-cols-6">

                    <Card>

                        <CardContent className="flex items-center justify-between py-4">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Records
                                </p>

                                <h2 className="text-3xl font-bold">
                                    {movements.total}
                                </h2>

                            </div>

                            <Package className="h-6 w-6 text-muted-foreground" />

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Stock In
                                </p>

                                <h2 className="text-3xl font-bold text-green-600">

                                    {
                                        movements.data.filter(
                                            m => m.type === "STOCK_IN"
                                        ).length
                                    }

                                </h2>

                            </div>

                            <ArrowDownToLine className="h-6 w-6 text-green-600"/>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Stock Out
                                </p>

                                <h2 className="text-3xl font-bold text-red-600">

                                    {
                                        movements.data.filter(
                                            m => m.type === "STOCK_OUT"
                                        ).length
                                    }

                                </h2>

                            </div>

                            <ArrowUpFromLine className="h-6 w-6 text-red-600"/>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Edited
                                </p>

                                <h2 className="text-3xl font-bold text-yellow-500">

                                    {
                                        movements.data.filter(
                                            m => m.type === "EDITED"
                                        ).length
                                    }

                                </h2>

                            </div>

                            <Pencil className="h-6 w-6 text-yellow-500"/>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Duplicated
                                </p>

                                <h2 className="text-3xl font-bold text-violet-600">

                                    {
                                        movements.data.filter(
                                            m => m.type === "DUPLICATED"
                                        ).length
                                    }

                                </h2>

                            </div>

                            <Copy className="h-6 w-6 text-violet-600"/>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Archived
                                </p>

                                <h2 className="text-3xl font-bold text-gray-600">

                                    {
                                        movements.data.filter(
                                            m => m.type === "ARCHIVED"
                                        ).length
                                    }

                                </h2>

                            </div>

                            <Archive className="h-6 w-6 text-gray-600"/>

                        </CardContent>

                    </Card>

                </div>

                <Card>

                    <CardHeader className="py-4">

                        <div className="flex items-center justify-between gap-4">

                            <div className="relative w-full max-w-sm">

                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    className="pl-9"
                                    placeholder="Search product..."
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                />

                            </div>

                            <div className="flex items-center gap-2">

                                <DropdownMenu>

                                    <DropdownMenuTrigger asChild>

                                        <Button
                                            variant="outline"
                                            className="gap-2"
                                        >

                                            <Filter className="h-4 w-4" />

                                            Filter

                                        </Button>

                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>

                                        <DropdownMenuItem onClick={() => setFilter("all")}>
                                            All
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("CREATED")}>
                                            Created
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("EDITED")}>
                                            Edited
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("ARCHIVED")}>
                                            Archived
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("DUPLICATED")}>
                                            Duplicated
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("STOCK_IN")}> 
                                            Stock In
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("STOCK_OUT")}> 
                                            Stock Out
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setFilter("STOCK_ADJUSTMENT")}
                                        >
                                            Stock Adjustment
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>

                                </DropdownMenu>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => setRevertOpen(true)}
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Revert Selected
                                </Button>

                            </div>

                        </div>

                    </CardHeader>

                    <CardContent>

                        <div className="rounded-lg border flex-1 overflow-hidden">

                            <div className="h-full overflow-auto">

                                <table className="w-full">

                                    <thead className="sticky top-0 bg-background z-20">

                                        <tr>

                                            <th className="p-3 text-left w-12">
                                                <Checkbox
                                                    checked={allEditedSelected}
                                                    onCheckedChange={toggleSelectAllEdited}
                                                    disabled={editableMovements.length === 0}
                                                />
                                            </th>

                                            <th className="p-3 text-left">
                                                Product
                                            </th>

                                            <th className="p-3 text-left">
                                                View
                                            </th>

                                            <th className="p-3 text-left">
                                                Action
                                            </th>

                                            <th className="p-3 text-left">
                                                Change
                                            </th>

                                            <th className="p-3 text-left">
                                                Before
                                            </th>

                                            <th className="p-3 text-left">
                                                After
                                            </th>

                                            <th className="p-3 text-left">
                                                User
                                            </th>

                                            <th className="p-3 text-left">
                                                Date
                                            </th>

                                            <th className="p-3 text-left">
                                                Remarks
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredMovements.map((movement) => (

                                            <tr
                                                key={movement.id}
                                                className="border-t transition-colors hover:bg-muted/40"
                                            >

                                                <td className="p-3">
                                                    <Checkbox
                                                        checked={selectedRows.includes(movement.id)}
                                                        disabled={movement.type !== "EDITED"}
                                                        onCheckedChange={(value) =>
                                                            toggleRowSelection(
                                                                Boolean(value),
                                                                movement.id
                                                            )
                                                        }
                                                    />
                                                </td>

                                                {/* Product */}

                                                <td className="p-3">

                                                    <div className="space-y-1">

                                                        <p className="font-medium">
                                                            {movement.product.name}
                                                        </p>

                                                        <Badge variant="secondary">
                                                            {movement.product.sku}
                                                        </Badge>

                                                    </div>

                                                </td>

                                                {/* Action */}

                                                <td className="p-3">

                                                    <Badge className={badgeColor(movement.type)}>

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
                                                        movement.type !== "STOCK_OUT" && (

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

                                                <td className="p-3">

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

                                                {/* NEW VIEW BUTTON */}

                                                <td className="p-3">

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => {

                                                            setSelectedMovement(movement);
                                                            setShowPrevious({});
                                                            setViewOpen(true);

                                                        }}
                                                    >

                                                        <Eye className="mr-2 h-4 w-4" />

                                                        View Details

                                                    </Button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>
                                    </table>

                            </div>

                        </div>

                        {/* Pagination */}

                        {movements.last_page > 1 && (

                            <div className="mt-4 flex items-center justify-between">

                                {/* Page Information */}

                                <p className="text-sm text-muted-foreground">

                                    Page {movements.current_page} of{" "}
                                    {movements.last_page}

                                </p>


                                {/* Pagination Buttons */}

                                <div className="flex items-center gap-2">

                                    {/* Previous */}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!movements.prev_page_url}
                                        onClick={() => {

                                            if (movements.prev_page_url) {

                                                router.get(
                                                    movements.prev_page_url,
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    }
                                                );

                                            }

                                        }}
                                    >

                                        <ArrowLeft className="mr-1 h-4 w-4" />

                                        Previous

                                    </Button>


                                    {/* Page Numbers */}

                                    {movements.links
                                        .filter(
                                            (link) =>
                                                link.label !==
                                                    "&laquo; Previous" &&
                                                link.label !==
                                                    "Next &raquo;"
                                        )
                                        .map((link, index) => (

                                            <Button
                                                key={index}
                                                variant={
                                                    link.active
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => {

                                                    if (link.url) {

                                                        router.get(
                                                            link.url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                            }
                                                        );

                                                    }

                                                }}
                                            >

                                                {link.label}

                                            </Button>

                                        ))}


                                    {/* Next */}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!movements.next_page_url}
                                        onClick={() => {

                                            if (movements.next_page_url) {

                                                router.get(
                                                    movements.next_page_url,
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    }
                                                );

                                            }

                                        }}
                                    >

                                        Next

                                        <ArrowRight className="ml-1 h-4 w-4" />

                                    </Button>

                                </div>

                            </div>

                        )}

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