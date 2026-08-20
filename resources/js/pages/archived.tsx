import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ArchivedToolbar } from "@/components/archived/archived-toolbar";
import { ArchivedTable } from "@/components/archived/archived-table";
import { ArchivedPagination } from "@/components/archived/archived-pagination";

import type {
    ArchivedProduct,
    ArchivedProducts,
} from "@/components/archived/archived-types";

type Props = {
    products: ArchivedProducts;

    filters?: {
        search?: string;
    };
};

export default function Archived({
    products: productList,
    filters,
}: Props) {
    const [search, setSearch] = useState(
        filters?.search ?? ""
    );

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const [productsData, setProductsData] = useState<ArchivedProduct[]>(
        productList.data
    );

    /*
    |--------------------------------------------------------------------------
    | Keep local table data synchronized with Laravel
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setProductsData(productList.data);
    }, [productList.data]);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                "/products/archived",
                {
                    search,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    /*
    |--------------------------------------------------------------------------
    | Selected products
    |--------------------------------------------------------------------------
    */

    const allSelected =
        productsData.length > 0 &&
        selectedRows.length === productsData.length;

    const toggleRow = (
        productId: number,
        checked: boolean
    ) => {
        if (checked) {
            setSelectedRows((prev) => [
                ...new Set([...prev, productId]),
            ]);

            return;
        }

        setSelectedRows((prev) =>
            prev.filter((id) => id !== productId)
        );
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelectedRows([]);
            return;
        }

        setSelectedRows(
            productsData.map((product) => product.id)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

    const restoreProduct = (
        product: ArchivedProduct
    ) => {
        router.patch(
            `/products/${product.id}/restore`,
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    setSelectedRows((prev) =>
                        prev.filter(
                            (id) => id !== product.id
                        )
                    );

                    toast.success(
                        "Product restored successfully.",
                        {
                            description: `${product.name} has been restored.`,
                        }
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to restore product."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Restore selected
    |--------------------------------------------------------------------------
    */

    const restoreSelected = () => {
        if (selectedRows.length === 0) {
            return;
        }

        const ids = [...selectedRows];

        ids.forEach((id) => {
            router.patch(
                `/products/${id}/restore`,
                {},
                {
                    preserveScroll: true,
                }
            );
        });

        setSelectedRows([]);

        toast.success(
            `${ids.length} products restored.`,
            {
                description:
                    "The selected products have been restored.",
            }
        );

        router.reload({
            only: ["products"],
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const deleteProduct = (
        product: ArchivedProduct
    ) => {
        router.delete(
            `/products/${product.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setSelectedRows((prev) =>
                        prev.filter(
                            (id) => id !== product.id
                        )
                    );

                    toast.success(
                        "Product deleted permanently.",
                        {
                            description: `${product.name} has been permanently deleted.`,
                        }
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to delete product."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete selected
    |--------------------------------------------------------------------------
    */

    const deleteSelected = () => {
        if (selectedRows.length === 0) {
            return;
        }

        const ids = [...selectedRows];

        ids.forEach((id) => {
            router.delete(
                `/products/${id}`,
                {
                    preserveScroll: true,
                }
            );
        });

        setSelectedRows([]);

        toast.success(
            `${ids.length} products deleted permanently.`
        );

        router.reload({
            only: ["products"],
        });
    };

    /*
    |--------------------------------------------------------------------------
    | View
    |--------------------------------------------------------------------------
    */

    const viewProduct = (
        product: ArchivedProduct
    ) => {
        router.visit(
            `/products/${product.id}`
        );
    };

    return (
        <>
            <Head title="Archived Products" />

            <div className="flex h-full min-h-0 flex-col space-y-6 overflow-hidden p-6">

                {/* Page Header */}

                <div className="flex shrink-0 items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Archived Products
                        </h1>

                        <p className="text-muted-foreground">
                            Manage products that have been moved to the archive.
                        </p>
                    </div>

                </div>

                {/* Main Card */}

                <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">

                    {/* Toolbar */}

                    <CardHeader className="shrink-0 px-6 py-5">

                        <ArchivedToolbar
                            search={search}
                            setSearch={setSearch}
                            selectedRows={selectedRows}
                            onRestoreSelected={restoreSelected}
                            onDeleteSelected={deleteSelected}
                        />

                    </CardHeader>

                    {/* Table */}

                    <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">

                        <ArchivedTable
                            products={productsData}
                            selectedRows={selectedRows}
                            onToggleRow={toggleRow}
                            onToggleAll={toggleAll}
                            allSelected={allSelected}
                            onRestore={restoreProduct}
                            onDelete={deleteProduct}
                            onView={viewProduct}
                        />

                        {/* Pagination */}

                        <ArchivedPagination
                            currentPage={productList.current_page}
                            lastPage={productList.last_page}
                            prevPageUrl={productList.prev_page_url}
                            nextPageUrl={productList.next_page_url}
                            links={[]}
                        />

                    </CardContent>

                </Card>

            </div>
        </>
    );
}

Archived.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: "/products",
        },
        {
            title: "Archived",
            href: "/products/archived",
        },
    ],
};