import { Head } from "@inertiajs/react";

export default function Products() {
    return (
        <>
            <Head title="Products" />

            <div className="p-6">
                <h1 className="text-3xl font-bold">
                    Products
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage your inventory products here.
                </p>
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