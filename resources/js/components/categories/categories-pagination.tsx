import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Props = {
    currentPage: number;
    lastPage: number;
    prevPageUrl: string | null;
    nextPageUrl: string | null;
};

export function CategoriesPagination({
    currentPage,
    lastPage,
    prevPageUrl,
    nextPageUrl,
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
                    value={currentPage}
                    onChange={(e) =>
                        router.get(
                            `/categories?page=${e.target.value}`
                        )
                    }
                >
                    {Array.from(
                        {
                            length: lastPage,
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
                        currentPage === 1
                    }
                    onClick={() => {
                        if (prevPageUrl) {
                            router.get(
                                prevPageUrl
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
                            lastPage,
                            5
                        ),
                    },
                    (_, i) => (
                        <Button
                            key={i}
                            variant={
                                currentPage ===
                                i + 1
                                    ? "default"
                                    : "outline"
                            }
                            disabled={
                                i + 1 >
                                lastPage
                            }
                            onClick={() =>
                                router.get(
                                    `/categories?page=${i + 1}`
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
                        currentPage ===
                        lastPage
                    }
                    onClick={() => {
                        if (nextPageUrl) {
                            router.get(
                                nextPageUrl
                            );
                        }
                    }}
                >
                    Next
                </Button>

            </div>

            {/* RIGHT - Page Indicator */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                Page {currentPage} of{" "}
                {lastPage}
            </div>

        </div>
    );
}
