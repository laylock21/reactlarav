import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ArchiveRestore } from "lucide-react";
import products from "@/routes/products";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { ArchivedToolbar } from "@/components/archived/archived-toolbar";
import { ArchivedTable } from "@/components/archived/archived-table";
import { ArchivedPagination } from "@/components/archived/archived-pagination";
import { ArchivedProductViewDialog } from "@/components/archived/archived-product-view-dialog";

import type {
    ArchivedProduct,
    ArchivedProductsResponse,
} from "@/components/archived/archived-types";

type Props = {
    products: ArchivedProductsResponse;

    filters?: {
        search?: string;
    };
};

export default function Archived({
    products: productList,
    filters,
}: Props) {

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

        setProductsData((prev) =>
            prev.filter((product) => !ids.includes(product.id))
        );

        setSelectedRows([]);

        toast.success(
            `${ids.length} products restored successfully.`,
            {
                description:
                    "The selected products have been restored.",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState(
        filters?.search ?? ""
    );

    /*
    |--------------------------------------------------------------------------
    | Local Product Data
    |--------------------------------------------------------------------------
    */

    const [productsData, setProductsData] = useState<
        ArchivedProduct[]
    >(productList.data);

    /*
    |--------------------------------------------------------------------------
    | Selected Rows
    |--------------------------------------------------------------------------
    */

    const [selectedRows, setSelectedRows] = useState<number[]>(
        []
    );

    const [selectedProduct, setSelectedProduct] =
        useState<ArchivedProduct | null>(null);

    const [viewOpen, setViewOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Synchronize backend data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setProductsData(productList.data);
    }, [productList.data]);

    /*
    |--------------------------------------------------------------------------
    | Select All
    |--------------------------------------------------------------------------
    */

    const allSelected =
        productsData.length > 0 &&
        selectedRows.length === productsData.length;

    const toggleRowSelection = (
        productId: number,
        checked: boolean
    ) => {

        if (checked) {

            setSelectedRows((prev) => [
                ...new Set([
                    ...prev,
                    productId,
                ]),
            ]);

            return;
        }

        setSelectedRows((prev) =>
            prev.filter(
                (id) => id !== productId
            )
        );
    };

    const toggleSelectAll = () => {

        if (allSelected) {
            setSelectedRows([]);
            return;
        }

        setSelectedRows(
            productsData.map(
                (product) => product.id
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

    const restoreProduct = (product: ArchivedProduct) => {
        router.patch(
            `/products/${product.id}/restore`,
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    setProductsData((prev) =>
                        prev.filter(
                            (item) => item.id !== product.id
                        )
                    );

                    setSelectedRows((prev) =>
                        prev.filter(
                            (id) => id !== product.id
                        )
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const deleteProduct = (product: ArchivedProduct) => {
        router.delete(
            `/products/${product.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setProductsData((prev) =>
                        prev.filter((item) => item.id !== product.id)
                    );

                    setSelectedRows((prev) =>
                        prev.filter((id) => id !== product.id)
                    );

                    toast.success("Product deleted successfully.", {
                        description:
                            "The archived product has been permanently deleted.",
                    });
                },

                onError: () => {
                    toast.error("Unable to delete product.", {
                        description:
                            "There was an error while deleting the archived product.",
                    });
                },
            }
        );
    };

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

        setProductsData((prev) =>
            prev.filter((product) => !ids.includes(product.id))
        );

        setSelectedRows([]);

        toast.success(
            `${ids.length} products deleted successfully.`,
            {
                description:
                    "The selected archived products have been permanently deleted.",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | View
    |--------------------------------------------------------------------------
    */

    const viewProduct = (product: ArchivedProduct) => {
        setSelectedProduct(product);
        setViewOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Archived Products" />

            <div className="
                flex
                h-full
                min-h-0
                flex-col
                space-y-6
                overflow-hidden
                p-6
            ">

                {/* Page Header */}

                <div className="shrink-0">

                    <h1 className="text-3xl font-bold">
                        Archived Products
                    </h1>

                    <p className="text-muted-foreground">
                        Manage products that have been moved to the archive.
                    </p>

                </div>

                {/* Main Card */}

                <Card className="
                    flex
                    min-h-0
                    flex-1
                    flex-col
                    overflow-hidden
                ">

                    {/* Toolbar */}

                    <CardHeader className="
                        shrink-0
                        px-6
                        py-5
                    ">

                        <ArchivedToolbar
                            search={search}
                            setSearch={setSearch}
                            selectedRows={selectedRows}
                            onRestoreSelected={
                                restoreSelected
                            }
                            onDeleteSelected={
                                deleteSelected
                            }
                        />

                    </CardHeader>

                    {/* Table + Pagination */}

                    <CardContent className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        overflow-hidden
                    ">

                        <ArchivedTable
                            products={productsData}
                            selectedRows={selectedRows}
                            allSelected={allSelected}
                            toggleRowSelection={
                                toggleRowSelection
                            }
                            toggleSelectAll={
                                toggleSelectAll
                            }
                            onView={viewProduct}
                            onRestore={
                                restoreProduct
                            }
                            onDelete={
                                deleteProduct
                            }
                        />

                        <ArchivedPagination
                            currentPage={
                                productList.current_page
                            }
                            lastPage={
                                productList.last_page
                            }
                            prevPageUrl={
                                productList.prev_page_url
                            }
                            nextPageUrl={
                                productList.next_page_url
                            }
                            links={
                                productList.links ?? []
                            }
                        />

                    </CardContent>

                </Card>

            </div>

            <ArchivedProductViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                product={selectedProduct}
                onRestore={() => {
                    if (!selectedProduct) return;

                    restoreProduct(selectedProduct);
                    setViewOpen(false);
                    setSelectedProduct(null);
                }}
            />
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