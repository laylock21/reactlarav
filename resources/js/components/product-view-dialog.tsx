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
        Package,
        Boxes,
        DollarSign,
        FileText,
        Calendar,
        Pencil,
    } from "lucide-react";

    import type { Product } from "@/types/product";

    type Props = {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        product: Product | null;
        onEdit?: () => void;
    };

    export function ProductViewDialog({
        open,
        onOpenChange,
        product,
        onEdit,
    }: Props) {
        if (!product) return null;

        const profit =
            Number(product.selling_price) - Number(product.cost_price);

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
                        <SheetTitle className="text-2xl">
                            Product Details 
                        </SheetTitle>
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
                                        {product.name}
                                    </h2>

                                    <p className="text-muted-foreground">
                                        SKU • {product.sku}
                                    </p>

                                    <div className="mt-3">

                                        <Badge>
                                            {product.status}
                                        </Badge>

                                    </div>

                                </div>

                            </div>

                            {/* RIGHT */}

                            <Button onClick={onEdit}>
                                <Pencil className="mr-2 h-4 w-4"/>
                                Edit Product
                            </Button>

                        </div>

                    </div>
                    {/* SUMMARY */}
                    <div className="grid grid-cols-4 gap-4">

                        <SummaryCard
                            title="Current Stock"
                            value={product.quantity}
                        />

                        <SummaryCard
                            title="Minimum"
                            value={product.minimum_stock}
                        />

                        <SummaryCard
                            title="Cost Price"
                            value={`₱${Number(product.cost_price).toLocaleString()}`}
                        />

                        <SummaryCard
                            title="Selling Price"
                            value={`₱${Number(product.selling_price).toLocaleString()}`}
                        />

                    </div>
                    <div className="grid grid-cols-3 gap-6">

                        {/* LEFT */}

                        <div className="col-span-2 space-y-6">

                            <div>

                                <div className="mb-3 flex items-center gap-2 font-semibold">
                                    <Package size={18} />
                                    Product Information
                                </div>

                                <Separator className="mb-4" />

                                <InfoRow
                                    label="SKU"
                                    value={product.sku}
                                />

                                <InfoRow
                                    label="Barcode"
                                    value={product.barcode || "-"}
                                />

                                <InfoRow
                                    label="Supplier"
                                    value={product.supplier}
                                />

                                <InfoRow
                                    label="Category"
                                    value={product.category}
                                />

                                <InfoRow
                                    label="Unit"
                                    value={product.unit}
                                />

                            </div>

                            <div>

                                <div className="mb-3 flex items-center gap-2 font-semibold">
                                    <FileText size={18} />
                                    Description
                                </div>

                                <Separator className="mb-4" />

                                <p className="text-sm text-muted-foreground">
                                    {product.description || "No description."}
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
                                    value={`${product.quantity}`}
                                />

                                <InfoRow
                                    label="Minimum Stock"
                                    value={`${product.minimum_stock}`}
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
                                    value={`₱${Number(product.cost_price).toLocaleString()}`}
                                />

                                <InfoRow
                                    label="Selling Price"
                                    value={`₱${Number(product.selling_price).toLocaleString()}`}
                                />

                                <InfoRow
                                    label="Profit"
                                    value={`₱${profit.toLocaleString()}`}
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
                                    value={new Date(product.created_at).toLocaleString()}
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

                        <Button onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Product
                        </Button>

                    </div>

                </SheetContent>
            </Sheet>
        );
    }

    function SummaryCard({
        title,
        value,
    }:{
        title:string;
        value:React.ReactNode;
    }){

        return(

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