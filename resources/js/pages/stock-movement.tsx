import { Head, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    };

    product?: {
        id: number;
        name: string;
    } | null;
};

export default function StockMovement({
    movements,
    product,
}: Props) {

    const [search, setSearch] = useState("");
    const [selectedMovement, setSelectedMovement] =
        useState<Movement | null>(null);
    const [showPrevious, setShowPrevious] = 
        useState<Record<string, boolean>>({});

    const [viewOpen, setViewOpen] = useState(false);

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

    const filteredMovements = useMemo(() => {
        let data = [...movements.data];

        data = data.filter(
            movement =>
                movement.product.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                movement.product.sku
                    .toLowerCase()
                    .includes(search.toLowerCase())
        );

        if (filter !== "all") {
            data = data.filter(m => m.type === filter);
        }

        return data;
    }, [movements.data, search, filter]);

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
        <>
            <Head title="Stock Movement" />

            <div className="space-y-6 p-6">

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

                        <CardContent className="flex items-center justify-between pt-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Records
                                </p>

                                <h2 className="text-3xl font-bold">
                                    {movements.data.length}
                                </h2>

                            </div>

                            <Package className="h-8 w-8 text-muted-foreground"/>

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

                            <ArrowDownToLine className="h-8 w-8 text-green-600"/>

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

                            <ArrowUpFromLine className="h-8 w-8 text-red-600"/>

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

                            <Pencil className="h-8 w-8 text-yellow-500"/>

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

                            <Copy className="h-8 w-8 text-violet-600"/>

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

                            <Archive className="h-8 w-8 text-gray-600"/>

                        </CardContent>

                    </Card>

                </div>

                <Card>

                    <CardHeader>

                        <div className="flex items-center justify-between">

                            <div className="relative w-full max-w-sm">

                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    className="pl-9"
                                    placeholder="Search product..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

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

                        </div>

                    </CardHeader>

                    <CardContent>

                        <div className="rounded-lg border overflow-hidden">

                            <div className="max-h-[650px] overflow-auto">

                                <table className="w-full">

                                    <thead className="sticky top-0 bg-background z-20">

                                        <tr>

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

                    </CardContent>

                </Card>

            </div>

            <StockMovementViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                movement={selectedMovement}
                showPrevious={showPrevious}
                setShowPrevious={setShowPrevious}
            />

        </>
    );
}