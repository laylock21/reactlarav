import { Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;

    selectedRows: number[];

    setDeleteOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setDeleteTarget: React.Dispatch<
        React.SetStateAction<number | null>
    >;

    onAddCategory: () => void;

};

export function CategoriesToolbar({
    search,
    setSearch,
    selectedRows,
    setDeleteOpen,
    setDeleteTarget,
    onAddCategory,
}: Props) {
    return (
        <div className="flex items-center justify-between gap-4">

            {/* Search */}

            <div className="relative w-full max-w-sm">

                <Search className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                " />

                <Input
                    placeholder="Search categories..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    className="pl-9"
                />

            </div>

            {/* Actions */}

            <div className="flex items-center gap-2">

                {/* Delete */}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={
                        selectedRows.length === 0
                    }
                    onClick={() => {
                        setDeleteTarget(null);
                        setDeleteOpen(true);
                    }}
                    className="transition-colors"
                >

                    <Trash2 className="mr-2 h-4 w-4" />

                    Delete

                </Button>

                <Button
                    onClick={onAddCategory}
                >
                    <Plus className="mr-2 h-4 w-4" />

                    Add Category
                </Button>

            </div>

        </div>
    );
}
