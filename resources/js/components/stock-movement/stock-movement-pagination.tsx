import { router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type StockMovementPaginationProps = {
    currentPage: number;
    lastPage: number;
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    links: PaginationLink[];
};

export function StockMovementPagination({
    currentPage,
    lastPage,
    prevPageUrl,
    nextPageUrl,
    links,
}: StockMovementPaginationProps) {

    if (lastPage <= 1) {
        return null;
    }

    const navigate = (url: string | null) => {
        if (!url) {
            return;
        }

        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <div className="mt-4 flex items-center justify-between">

            {/* Page Information */}

            <p className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
            </p>

            {/* Pagination Buttons */}

            <div className="flex items-center gap-2">

                {/* Previous */}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!prevPageUrl}
                    onClick={() => navigate(prevPageUrl)}
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />

                    Previous
                </Button>

                {/* Page Numbers */}

                {links
                    .filter(
                        (link) =>
                            link.label !== "&laquo; Previous" &&
                            link.label !== "Next &raquo;"
                    )
                    .map((link, index) => (
                        <Button
                            key={index}
                            variant={
                                link.active
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            disabled={!link.url}
                            onClick={() => navigate(link.url)}
                        >
                            {link.label}
                        </Button>
                    ))}

                {/* Next */}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!nextPageUrl}
                    onClick={() => navigate(nextPageUrl)}
                >
                    Next

                    <ArrowRight className="ml-1 h-4 w-4" />
                </Button>

            </div>

        </div>
    );
}