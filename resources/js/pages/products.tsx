import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Products() {
    return (
        <>
            <Head title="Products" />

            <div className="space-y-6 p-6">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Products
                        </h1>

                        <p className="text-muted-foreground">
                            Manage all inventory products.
                        </p>
                    </div>

                    <button>
                        + Add Product
                    </button>

                </div>
                <div className="flex gap-4">

                        <Input placeholder="Search products..." />

                </div>
                <div className="rounded-xl border">
                    <table className="w-full">

                        <thead>

                            <tr className="border-b">

                                <th className="p-4 text-left">SKU</th>
                                <th className="p-4 text-left">Product</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Stock</th>
                                <th className="p-4 text-left">Price</th>
                                <th className="p-4 text-left">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="p-4">P001</td>
                                <td className="p-4">Mouse</td>
                                <td className="p-4">Peripherals</td>
                                <td className="p-4">50</td>
                                <td className="p-4">₱450</td>
                                <td className="p-4">✏️ 🗑️</td>

                            </tr>

                        </tbody>

                    </table>

                </div>
            </div>
        </>
    );
}


Products.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: "/products",
        },
    ],
};