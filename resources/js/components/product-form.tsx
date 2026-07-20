import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm() {
    return (
        <div className="space-y-8">

            {/* Product Information */}
            <div className="space-y-4">

                <h3 className="text-lg font-semibold">
                    Product Information
                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <Label>Product Name</Label>
                        <Input placeholder="Logitech G102" />
                    </div>

                    <div>
                        <Label>SKU</Label>
                        <Input placeholder="P001" />
                    </div>

                    <div>
                        <Label>Barcode</Label>
                        <Input placeholder="123456789012" />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Input placeholder="Mouse" />
                    </div>

                    <div>
                        <Label>Supplier</Label>
                        <Input placeholder="Logitech" />
                    </div>

                    <div>
                        <Label>Unit</Label>
                        <Input placeholder="Piece" />
                    </div>

                </div>

            </div>

            {/* Inventory */}

            <div className="space-y-4">

                <h3 className="text-lg font-semibold">
                    Inventory
                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <Label>Quantity</Label>
                        <Input type="number" />
                    </div>

                    <div>
                        <Label>Minimum Stock</Label>
                        <Input type="number" />
                    </div>

                </div>

            </div>

            {/* Pricing */}

            <div className="space-y-4">

                <h3 className="text-lg font-semibold">
                    Pricing
                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <Label>Cost Price</Label>
                        <Input type="number" />
                    </div>

                    <div>
                        <Label>Selling Price</Label>
                        <Input type="number" />
                    </div>

                </div>

            </div>

            {/* Description */}

            <div>

                <Label>Description</Label>

                <Textarea
                    rows={5}
                    placeholder="Additional product information..."
                />

            </div>

        </div>
    );
}