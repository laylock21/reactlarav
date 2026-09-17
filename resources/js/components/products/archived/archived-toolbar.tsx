import { Search, RotateCcw, Trash2, ArchiveRestore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ArchivedToolbarProps = {
    search: string;
    setSearch: (value: string) => void;

    selectedRows: number[];

    onRestoreSelected: () => void;
    onDeleteSelected: () => void;
};

export function ArchivedToolbar({
    search,
    setSearch,
    selectedRows,
    onRestoreSelected,
    onDeleteSelected,
}: ArchivedToolbarProps) {

    const hasSelection = selectedRows.length > 0;

    return (
        <div className="flex items-center justify-between gap-4">

            {/* Search */}

            <div className="relative w-full max-w-sm">

                <Search
                    className="
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-muted-foreground
                    "
                />

                <Input
                    placeholder="Search archived products..."
                    className="pl-9"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

            </div>

            {/* Actions */}

            <div className="flex items-center gap-2">

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasSelection}
                    onClick={onRestoreSelected}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />

                    Restore Selected
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasSelection}
                    onClick={onDeleteSelected}
                    className="
                        text-red-600
                        hover:text-red-700
                    "
                >
                    <Trash2 className="mr-2 h-4 w-4" />

                    Delete Selected
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedRows.length === 0}
                    onClick={onRestoreSelected}
                    className="transition-colors duration-300 ease-out"
                >
                    <ArchiveRestore
                        className={`mr-2 h-4 w-4 transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-green-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    />

                    <span
                        className={`transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-green-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    >
                        Restore
                    </span>
                </Button>

            </div>



        </div>
    );
}