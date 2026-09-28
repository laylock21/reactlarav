import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;

    onAddCategory: () => void;
};

export function CategoriesToolbar({
    search,
    setSearch,
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
