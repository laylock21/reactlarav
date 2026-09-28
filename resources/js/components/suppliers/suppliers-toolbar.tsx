import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Trash2, Plus } from "lucide-react";

import type { Supplier } from "./suppliers-types";

type Props = {
    search: string;
    setSearch: (value: string) => void;

    selectedRows: number[];

    setDeleteTarget: (supplier: Supplier | null) => void;
    setDeleteOpen: (open: boolean) => void;
    setBulkDelete: (value: boolean) => void;

    onAddSupplier: () => void;
};

export function SuppliersToolbar({
    search,
    setSearch,

    selectedRows,

    setDeleteTarget,
    setDeleteOpen,
    setBulkDelete,

    onAddSupplier,
}: Props) {
    return (
        <div className="flex items-center justify-between gap-4">

            {/* Search */}
            <div className="relative max-w-sm w-full">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    placeholder="Search suppliers..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;

                        setSearch(value);

                        router.get(
                            "/suppliers",
                            {
                                search: value,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            }
                        );
                    }}
                />

            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

                {/* Delete */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                        setBulkDelete(true);
                        setDeleteTarget(null);
                        setDeleteOpen(true);
                    }}
                    className="transition-colors duration-300 ease-out"
                >

                    <Trash2
                        className={`mr-2 h-4 w-4 transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-red-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    />

                    <span
                        className={`transition-all duration-200 ${
                            selectedRows.length > 0
                                ? "text-red-600 scale-100"
                                : "text-muted-foreground scale-95"
                        }`}
                    >
                        Delete
                    </span>

                </Button>

                {/* Add Supplier */}
                <Button
                    onClick={onAddSupplier}
                >

                    <Plus className="mr-2 h-4 w-4" />

                    Add Supplier

                </Button>

            </div>

        </div>
    );
}
