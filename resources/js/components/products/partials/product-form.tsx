import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/components/categories/categories-types";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    categories: Category[];
};

export function ProductForm({
    form,
    setForm,
    categories,
}: ProductFormProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        []
    );

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    return (
        <div className="space-y-10 px-2">

            {/* Product Images */}

            <div className="space-y-4">

                <div className="border-b pb-3">

                    <h3 className="text-lg font-semibold">
                        Product Images
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add one or more images to display this product.
                    </p>

                </div>

                <div className="flex flex-wrap gap-4">

                    {imagePreviews.map((preview, index) => (
                        <div
                            key={preview}
                            className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted"
                        >
                            <img
                                src={preview}
                                alt={`Product image ${index + 1}`}
                                className="h-full w-full object-cover"
                            />

                            <button
                                type="button"
                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white hover:bg-black"
                                onClick={() => {
                                    setImagePreviews((prev) =>
                                        prev.filter(
                                            (_, imageIndex) =>
                                                imageIndex !== index
                                        )
                                    );

                                    setImageFiles((prev) =>
                                        prev.filter(
                                            (_, imageIndex) =>
                                                imageIndex !== index
                                        )
                                    );
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground transition hover:bg-muted/50">

                        <span className="text-2xl">
                            +
                        </span>

                        <span className="mt-1 text-sm">
                            Add Images
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(event) => {
                                const files = Array.from(
                                    event.target.files ?? []
                                );

                                if (files.length === 0) {
                                    return;
                                }

                                const previews = files.map((file) =>
                                    URL.createObjectURL(file)
                                );

                                setImageFiles((prev) => [
                                    ...prev,
                                    ...files,
                                ]);

                                setImagePreviews((prev) => [
                                    ...prev,
                                    ...previews,
                                ]);

                                event.target.value = "";
                            }}
                        />

                    </label>

                </div>

            </div>

            {/* Product Information */}
            <div className="space-y-4">

                <div className="border-b pb-3">

                    <h3 className="text-lg font-semibold">
                        Product Information
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Basic information used to identify this product.
                    </p>

                </div>

                <div className="grid grid-cols-3 gap-5">

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">
                        <Label>Category</Label>

                        <Select
                            value={form.category_id?.toString() ?? ""}
                            onValueChange={(value) =>
                                setForm({
                                    ...form,
                                    category_id: Number(value),
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>

                        <div className="rounded-md border p-3">
                            {!form.sub_category_id ? (
                                <p className="text-sm text-muted-foreground">
                                    Select a Sub-category first.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {(
                                        categories
                                            .find(
                                                (category) =>
                                                    category.id === Number(form.category_id)
                                            )
                                            ?.sub_categories?.find(
                                                (subCategory) =>
                                                    subCategory.id ===
                                                    Number(form.sub_category_id)
                                            )
                                            ?.tags ?? []
                                    ).map((tag) => {
                                        const selected =
                                            (form.tag_ids ?? []).includes(tag.id);

                                        return (
                                            <Badge
                                                key={tag.id}
                                                variant={selected ? "default" : "outline"}
                                                className="cursor-pointer rounded-full px-3 py-1"
                                                onClick={() => {
                                                    const currentTags =
                                                        form.tag_ids ?? [];

                                                    setForm({
                                                        ...form,
                                                        tag_ids: selected
                                                            ? currentTags.filter(
                                                                (id: number) =>
                                                                    id !== tag.id
                                                            )
                                                            : [
                                                                ...currentTags,
                                                                tag.id,
                                                            ],
                                                    });
                                                }}
                                            >
                                                {selected ? "× " : "+ "}
                                                {tag.name}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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
                        <Label>Status</Label>

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

                <div className="border-b pb-3">

                    <h3 className="text-lg font-semibold">
                        Inventory
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Configure available stock and inventory limits.
                    </p>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                <div className="border-b pb-3">

                    <h3 className="text-lg font-semibold">
                        Pricing
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Product purchasing and selling prices.
                    </p>

                </div>
                

                <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">

                        <Label>Profit</Label>

                        <Input
                            disabled
                            value={`₱${(
                                Number(form.selling_price) -
                                Number(form.cost_price)
                            ).toLocaleString()}`}
                        />

                    </div>

                </div>

            </div>

            {/* Description */}

            <div>

                <div className="border-b pb-3 mb-4">

                    <h3 className="text-lg font-semibold">
                        Notes
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Additional product information.
                    </p>

                </div>

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
