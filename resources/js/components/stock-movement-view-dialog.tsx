import type { Dispatch, SetStateAction } from "react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    Package,
    Boxes,
    FileText,
    Calendar,
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
    open: boolean;
    onOpenChange: (open: boolean) => void;
    movement: Movement | null;
    showPrevious: Record<string, boolean>;
    setShowPrevious: Dispatch<SetStateAction<Record<string, boolean>>>;
};

export function StockMovementViewDialog({
    open,
    onOpenChange,
    movement,
    showPrevious,
    setShowPrevious,
}: Props) {
    if (!movement) return null;

    const prettyAction = (type: string) => type.replaceAll("_", " ");

    const labels: Record<string, string> = {
        sku: "SKU",
        barcode: "Barcode",
        name: "Product Name",
        supplier: "Supplier",
        category: "Category",
        unit: "Unit",
        quantity: "Quantity",
        minimum_stock: "Minimum Stock",
        cost_price: "Cost Price",
        selling_price: "Selling Price",
        status: "Status",
        description: "Description",
    };

    const formatValue = (field: string, value: any) => {
        if (value === null || value === undefined || value === "") {
            return "—";
        }

        if (field === "cost_price" || field === "selling_price") {
            return `₱${Number(value).toLocaleString()}`;
        }

        return String(value);
    };

    const snapshot = movement.after_data ?? movement.before_data ?? {};

    const changedFields = Object.keys(snapshot).filter((field) => {
        const before = movement.before_data?.[field as keyof ProductSnapshot];
        const after = movement.after_data?.[field as keyof ProductSnapshot];
        return before !== after;
    });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="
                    fixed
                    right-0
                    top-0
                    h-screen
                    w-[56vw]
                    max-w-[980px]
                    rounded-none
                    sm:max-w-none
                    border-l
                    bg-background
                    p-8
                    overflow-y-auto

                    data-[state=open]:animate-in
                    data-[state=closed]:animate-out
                    data-[state=open]:slide-in-from-right
                    data-[state=closed]:slide-out-to-right
                "
            >
                <SheetHeader>
                    <SheetTitle className="text-2xl">
                        Product Change Details
                    </SheetTitle>
                </SheetHeader>

                <div className="rounded-xl border bg-card p-6">
                    <div className="flex justify-between gap-8">
                        <div className="flex gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted">
                                <Package size={38} />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold leading-tight">
                                    {movement.product.name}
                                </h2>

                                <p className="text-sm text-muted-foreground mt-1">
                                    SKU • {movement.product.sku}
                                </p>

                                <div className="mt-3">
                                    <Badge>{prettyAction(movement.type)}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                            <div className="text-right text-sm text-muted-foreground">
                                {new Date(movement.created_at).toLocaleString()}
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                                {movement.user?.name ?? "System"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                    <SummaryCard title="Action" value={prettyAction(movement.type)} />
                    <SummaryCard title="Quantity" value={movement.quantity} />
                    <SummaryCard title="Before" value={movement.before_quantity} />
                    <SummaryCard title="After" value={movement.after_quantity} />
                </div>

                <div className="grid grid-cols-[3fr_1fr] gap-6 mt-6">
                    <div className="col-span-2 space-y-6">
                        <div>
                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <Package size={18} />
                                Product Information
                            </div>

                            <Separator className="mb-4" />

                            <div className="space-y-3">
                                {[
                                    "sku",
                                    "barcode",
                                    "name",
                                    "supplier",
                                    "category",
                                    "unit",
                                    "quantity",
                                    "minimum_stock",
                                    "cost_price",
                                    "selling_price",
                                    "status",
                                ].map((field) => {
                                    const before = movement.before_data?.[field as keyof ProductSnapshot];
                                    const after = movement.after_data?.[field as keyof ProductSnapshot];
                                    const changed = before !== after;
                                    const value = changed
                                        ? showPrevious[field]
                                            ? before
                                            : after
                                        : after ?? before;

                                    return (
                                        <div
                                            key={field}
                                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                                                changed
                                                    ? "border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
                                                    : "border-slate-200 bg-background"
                                            }`}
                                        >
                                            <span className="text-muted-foreground">
                                                {labels[field] ?? field}
                                            </span>

                                            <span
                                                onClick={() => {
                                                    if (!changed) return;
                                                    setShowPrevious((prev) => ({
                                                        ...prev,
                                                        [field]: !prev[field],
                                                    }));
                                                }}
                                                className={`font-medium ${changed ? "cursor-pointer text-green-600" : ""}`}
                                            >
                                                {formatValue(field, value)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <FileText size={18} />
                                Description
                            </div>

                            <Separator className="mb-4" />

                            <p className="text-sm leading-6 text-muted-foreground">
                                {movement.after_data?.description ?? movement.before_data?.description ?? "No description."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <Calendar size={18} />
                                History
                            </div>

                            <Separator className="mb-4" />

                            <InfoRow label="Created" value={new Date(movement.created_at).toLocaleString()} />
                            <InfoRow label="User" value={movement.user?.name ?? "System"} />
                            <InfoRow label="Remarks" value={movement.remarks ?? "No remarks."} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function SummaryCard({
    title,
    value,
}: {
    title: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border p-5">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span>{value}</span>
        </div>
    );
}
