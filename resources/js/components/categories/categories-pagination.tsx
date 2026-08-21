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
        <div className="
            flex
            items-center
            justify-between
            border-t
            pt-4
        ">

            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
            </span>

            <div className="flex gap-2">

                <Button
                    variant="outline"
                    disabled={!prevPageUrl}
                    onClick={() => {
                        if (prevPageUrl) {
                            router.get(
                                prevPageUrl,
                                {},
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                }
                            );
                        }
                    }}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    disabled={!nextPageUrl}
                    onClick={() => {
                        if (nextPageUrl) {
                            router.get(
                                nextPageUrl,
                                {},
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                }
                            );
                        }
                    }}
                >
                    Next
                </Button>

            </div>

        </div>
    );
}