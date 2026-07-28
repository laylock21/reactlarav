import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ProductFormProps = {
    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
};

export function ProductForm({
    form,
    setForm,
}: ProductFormProps) {
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
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Logitech G102"
                        />
                    </div>

                    <div>
                        <Label>SKU</Label>
                        <Input
                            value={form.sku}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    sku: e.target.value,
                                })
                            }
                            placeholder="P001"
                        />
                    </div>

                    <div>
                        <Label>Barcode</Label>
                        <Input
                            value={form.barcode}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    barcode: e.target.value,
                                })
                            }
                            placeholder="123456789012"
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Input
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value,
                                })
                            }
                            placeholder="Mouse"
                        />
                    </div>

                    <div>
                        <Label>Supplier</Label>
                        <Input
                            value={form.supplier}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    supplier: e.target.value,
                                })
                            }
                            placeholder="Logitech"
                        />
                    </div>

                    <div>
                        <Label>Unit</Label>
                        <Input
                            value={form.unit}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    unit: e.target.value,
                                })
                            }
                            placeholder="Piece"
                        />
                    </div>
                    <div className="space-y-2">
                        <label>Status</label>

                        <Select
                            value={form.status}
                            onValueChange={(value) =>
                                setForm({
                                    ...form,
                                    status: value,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Pending">
                                    Pending
                                </SelectItem>

                                <SelectItem value="Delivered">
                                    Delivered
                                </SelectItem>

                                <SelectItem value="In Transit">
                                    In Transit
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Input
                            type="number"
                            value={form.quantity}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    quantity: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div>
                        <Label>Minimum Stock</Label>
                        <Input
                            type="number"
                            value={form.minimum_stock}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    minimum_stock: Number(e.target.value),
                                })
                            }
                        />
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
                        <Input
                            type="number"
                            value={form.cost_price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cost_price: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div>
                        <Label>Selling Price</Label>
                        <Input
                            type="number"
                            value={form.selling_price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    selling_price: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                </div>

            </div>

            {/* Description */}

            <div>

                <Label>Description</Label>

                <Textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value,
                        })
                    }
                    placeholder="Additional product information..."
                />

            </div>

        </div>
    );
}