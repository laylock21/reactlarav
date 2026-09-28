import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";

import type { SupplierList } from "./suppliers-types";

type Props = {
    supplierList: SupplierList;
};

export function SuppliersPagination({
    supplierList,
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
                    value={supplierList.current_page}
                    onChange={(e) =>
                        router.get(
                            `/suppliers?page=${e.target.value}`
                        )
                    }
                >
                    {Array.from(
                        {
                            length: supplierList.last_page,
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
                        supplierList.current_page === 1
                    }
                    onClick={() => {
                        if (supplierList.prev_page_url) {
                            router.get(
                                supplierList.prev_page_url
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
                            supplierList.last_page,
                            5
                        ),
                    },
                    (_, i) => (
                        <Button
                            key={i}
                            variant={
                                supplierList.current_page ===
                                i + 1
                                    ? "default"
                                    : "outline"
                            }
                            disabled={
                                i + 1 >
                                supplierList.last_page
                            }
                            onClick={() =>
                                router.get(
                                    `/suppliers?page=${i + 1}`
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
                        supplierList.current_page ===
                        supplierList.last_page
                    }
                    onClick={() => {
                        if (supplierList.next_page_url) {
                            router.get(
                                supplierList.next_page_url
                            );
                        }
                    }}
                >
                    Next
                </Button>

            </div>

            {/* RIGHT - Page Indicator */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                Page {supplierList.current_page} of{" "}
                {supplierList.last_page}
            </div>

        </div>
    );
}
