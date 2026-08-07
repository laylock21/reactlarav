import type { Dispatch, SetStateAction } from "react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Package,
    Boxes,
    DollarSign,
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
    onRevert?: () => void;
};

export function StockMovementViewDialog({
    open,
    onOpenChange,
    movement,
    showPrevious,
    setShowPrevious,
    onRevert,
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

    const changedFields = [
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
    ].filter((field) => {
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
                    w-[55vw]
                    max-w-none
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
                    <div className="flex items-center justify-between gap-4">
                        <SheetTitle className="text-2xl">
                            Stock Movement Details
                        </SheetTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Revert Edit</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Revert this stock movement?</DialogTitle>
                                <DialogDescription>
                                    Reverting will restore the product back to its original state before this stock movement. This cannot be undone.
                                </DialogDescription>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={!onRevert}
                                            onClick={onRevert}
                                        >
                                            Revert changes
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </SheetHeader>
                {/* HEADER CARD */}

                <div className="rounded-xl border bg-card p-6">

                    <div className="flex justify-between">

                        {/* LEFT */}

                        <div className="flex gap-5">

                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted">

                                <Package size={40} />

                            </div>

                            <div>

                                <h2 className="text-3xl font-bold">
                                    {movement.product.name}
                                </h2>

                                <p className="text-muted-foreground">
                                    SKU • {movement.product.sku}
                                </p>

                                <div className="mt-3">

                                    <Badge>
                                        {prettyAction(movement.type)}
                                    </Badge>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="text-right text-sm text-muted-foreground">
                            <div>{new Date(movement.created_at).toLocaleString()}</div>
                            <div className="mt-2">{movement.user?.name ?? "System"}</div>
                        </div>

                    </div>

                </div>

                {/* SUMMARY (use snapshot like product) */}

                <div className="grid grid-cols-4 gap-4 mt-4">
                    {(() => {
                        const snapshot = movement.after_data ?? movement.before_data ?? {};
                        return (
                            <>
                                <SummaryCard title="Current Stock" value={snapshot.quantity ?? "-"} />
                                <SummaryCard title="Minimum" value={snapshot.minimum_stock ?? "-"} />
                                <SummaryCard title="Cost Price" value={snapshot.cost_price ? `₱${Number(snapshot.cost_price).toLocaleString()}` : "-"} />
                                <SummaryCard title="Selling Price" value={snapshot.selling_price ? `₱${Number(snapshot.selling_price).toLocaleString()}` : "-"} />
                            </>
                        );
                    })()}
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6">

                    {/* LEFT */}

                    <div className="col-span-2 space-y-6">

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <Package size={18} />
                                Product Information
                            </div>

                            <Separator className="mb-4" />

                            <InfoRow label="SKU" value={(() => {
                                const before = movement.before_data?.sku;
                                const after = movement.after_data?.sku;
                                const changed = before !== after;
                                const value = changed ? (showPrevious["sku"] ? before : after) : after ?? before;
                                return (
                                    <span
                                        onClick={() => changed && setShowPrevious((p) => ({ ...p, sku: !p["sku"] }))}
                                        className={`font-medium ${changed ? `cursor-pointer ${showPrevious["sku"] ? "text-orange-600" : "text-green-600"}` : ""}`}
                                    >
                                        {formatValue("sku", value)}
                                    </span>
                                );
                            })()} />

                            <InfoRow label="Barcode" value={(() => {
                                const before = movement.before_data?.barcode;
                                const after = movement.after_data?.barcode;
                                const changed = before !== after;
                                const value = changed ? (showPrevious["barcode"] ? before : after) : after ?? before;
                                return (
                                    <span
                                        onClick={() => changed && setShowPrevious((p) => ({ ...p, barcode: !p["barcode"] }))}
                                        className={`font-medium ${changed ? `cursor-pointer ${showPrevious["barcode"] ? "text-orange-600" : "text-green-600"}` : ""}`}
                                    >
                                        {formatValue("barcode", value)}
                                    </span>
                                );
                            })()} />

                            <InfoRow label="Supplier" value={(() => {
                                const before = movement.before_data?.supplier;
                                const after = movement.after_data?.supplier;
                                const changed = before !== after;
                                const value = changed ? (showPrevious["supplier"] ? before : after) : after ?? before;
                                return (
                                    <span
                                        onClick={() => changed && setShowPrevious((p) => ({ ...p, supplier: !p["supplier"] }))}
                                        className={`font-medium ${changed ? `cursor-pointer ${showPrevious["supplier"] ? "text-orange-600" : "text-green-600"}` : ""}`}
                                    >
                                        {formatValue("supplier", value)}
                                    </span>
                                );
                            })()} />

                            <InfoRow label="Category" value={(() => {
                                const before = movement.before_data?.category;
                                const after = movement.after_data?.category;
                                const changed = before !== after;
                                const value = changed ? (showPrevious["category"] ? before : after) : after ?? before;
                                return (
                                    <span
                                        onClick={() => changed && setShowPrevious((p) => ({ ...p, category: !p["category"] }))}
                                        className={`font-medium ${changed ? `cursor-pointer ${showPrevious["category"] ? "text-orange-600" : "text-green-600"}` : ""}`}
                                    >
                                        {formatValue("category", value)}
                                    </span>
                                );
                            })()} />

                            <InfoRow label="Unit" value={(() => {
                                const before = movement.before_data?.unit;
                                const after = movement.after_data?.unit;
                                const changed = before !== after;
                                const value = changed ? (showPrevious["unit"] ? before : after) : after ?? before;
                                return (
                                    <span
                                        onClick={() => changed && setShowPrevious((p) => ({ ...p, unit: !p["unit"] }))}
                                        className={`font-medium ${changed ? `cursor-pointer ${showPrevious["unit"] ? "text-orange-600" : "text-green-600"}` : ""}`}
                                    >
                                        {formatValue("unit", value)}
                                    </span>
                                );
                            })()} />

                        </div>

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <FileText size={18} />
                                Description
                            </div>

                            <Separator className="mb-4" />

                            <p className="text-sm text-muted-foreground">
                                {movement.after_data?.description ?? movement.before_data?.description ?? "No description."}
                            </p>

                        </div>

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">

                                <Boxes size={18}/>

                                Recent Stock Movement

                            </div>

                            <Separator className="mb-4"/>

                            <div className="rounded-lg border p-6 text-center text-muted-foreground">

                                No stock movement recorded.

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="space-y-6">

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <Boxes size={18} />
                                Inventory
                            </div>

                            <Separator className="mb-4" />

                            <InfoRow
                                label="Current Stock"
                                value={`${movement.after_data?.quantity ?? movement.before_data?.quantity ?? "-"}`}
                            />

                            <InfoRow
                                label="Minimum Stock"
                                value={`${movement.after_data?.minimum_stock ?? movement.before_data?.minimum_stock ?? "-"}`}
                            />

                        </div>

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <DollarSign size={18} />
                                Pricing
                            </div>

                            <Separator className="mb-4" />

                            <InfoRow
                                label="Cost Price"
                                value={`₱${Number(movement.after_data?.cost_price ?? movement.before_data?.cost_price ?? 0).toLocaleString()}`}
                            />

                            <InfoRow
                                label="Selling Price"
                                value={`₱${Number(movement.after_data?.selling_price ?? movement.before_data?.selling_price ?? 0).toLocaleString()}`}
                            />

                            <InfoRow
                                label="Profit"
                                value={`₱${(Number(movement.after_data?.selling_price ?? movement.before_data?.selling_price ?? 0) - Number(movement.after_data?.cost_price ?? movement.before_data?.cost_price ?? 0)).toLocaleString()}`}
                            />

                        </div>

                        <div>

                            <div className="mb-3 flex items-center gap-2 font-semibold">
                                <Calendar size={18} />
                                History
                            </div>

                            <Separator className="mb-4" />

                            <InfoRow
                                label="Created"
                                value={new Date(movement.created_at).toLocaleString()}
                            />

                        </div>

                    </div>

                </div>

                <div className="flex justify-end gap-2">

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
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
            <div className="text-sm text-muted-foreground">
                {title}
            </div>
            <div className="mt-2 text-2xl font-bold">
                {value}
            </div>
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
        <div className="flex justify-between border-b py-2 text-sm">
            <span className="text-muted-foreground">
                {label}
            </span>
            <span className="font-medium">
                {value}
            </span>
        </div>
    );
}
