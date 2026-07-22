import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

type Product = {
    id: number;
    sku: string;
    barcode: string | null;
    name: string;
    supplier: string;
    category: string;
    unit: string;
    quantity: number;
    minimum_stock: number;
    cost_price: number;
    selling_price: number;
    status: string;
    description: string |null;
    created_at: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
};

export function ProductViewDialog({
    open,
    onOpenChange,
    product,
}: Props) {

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">

                <DialogHeader>

                    <DialogTitle>
                        Product Details
                    </DialogTitle>

                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Product Name
                        </p>

                        <p className="font-medium">
                            {product.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            SKU
                        </p>

                        <p>{product.sku}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Barcode
                        </p>

                        <p>{product.barcode ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Supplier
                        </p>

                        <p>{product.supplier}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Category
                        </p>

                        <p>{product.category}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Unit
                        </p>

                        <p>{product.unit}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Stock
                        </p>

                        <p>{product.quantity}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Minimum Stock
                        </p>

                        <p>{product.minimum_stock}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Cost Price
                        </p>

                        <p>₱{Number(product.cost_price).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Selling Price
                        </p>

                        <p>₱{Number(product.selling_price).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>

                        <Badge>
                            {product.status}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Created
                        </p>

                        <p>
                            {new Date(product.created_at).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                <div className="mt-6">

                    <p className="text-sm text-muted-foreground">
                        Description
                    </p>

                    <p className="mt-2">
                        {product.description || "No description"}
                    </p>

                </div>

            </DialogContent>
        </Dialog>
    );
}