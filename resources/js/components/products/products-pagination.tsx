import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";

import type { ProductList } from "./products-types";

type Props = {
    productList: ProductList;
};

export function ProductsPagination({
    productList,
}: Props) {
    return (
        <div className="mt-6 flex items-center justify-between">

            {/* LEFT - Go to Page */}
            <div className="flex items-center gap-2">

                <span className="text-sm text-muted-foreground">
                    Go to page
                </span>

                <select
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                    value={productList.current_page}
                    onChange={(e) =>
                        router.get(
                            `/products?page=${e.target.value}`
                        )
                    }
                >
                    {Array.from(
                        {
                            length: productList.last_page,
                        },
                        (_, i) => (
                            <option
                                key={i + 1}
                                value={i + 1}
                            >
                                {i + 1}
                            </option>
                        )
                    )}
                </select>

            </div>

            {/* CENTER - Pagination */}
            <div className="flex items-center gap-2">

                {/* Previous */}
                <Button
                    variant="outline"
                    disabled={
                        productList.current_page === 1
                    }
                    onClick={() => {
                        if (productList.prev_page_url) {
                            router.get(
                                productList.prev_page_url
                            );
                        }
                    }}
                >
                    Previous
                </Button>

                {/* Page Numbers */}
                {Array.from(
                    {
                        length: Math.max(
                            productList.last_page,
                            5
                        ),
                    },
                    (_, i) => (
                        <Button
                            key={i}
                            variant={
                                productList.current_page ===
                                i + 1
                                    ? "default"
                                    : "outline"
                            }
                            disabled={
                                i + 1 >
                                productList.last_page
                            }
                            onClick={() =>
                                router.get(
                                    `/products?page=${i + 1}`
                                )
                            }
                        >
                            {i + 1}
                        </Button>
                    )
                )}

                {/* Next */}
                <Button
                    variant="outline"
                    disabled={
                        productList.current_page ===
                        productList.last_page
                    }
                    onClick={() => {
                        if (productList.next_page_url) {
                            router.get(
                                productList.next_page_url
                            );
                        }
                    }}
                >
                    Next
                </Button>

            </div>

            {/* RIGHT - Page Indicator */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                Page {productList.current_page} of{" "}
                {productList.last_page}
            </div>

        </div>
    );
}