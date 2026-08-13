import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Search,
    Filter,
    RotateCcw,
} from "lucide-react";

type FilterType =
    | "all"
    | "CREATED"
    | "EDITED"
    | "ARCHIVED"
    | "DUPLICATED"
    | "STOCK_IN"
    | "STOCK_OUT"
    | "STOCK_ADJUSTMENT";

type StockMovementToolbarProps = {
    search: string;
    setSearch: (value: string) => void;

    filter: FilterType;
    setFilter: (value: FilterType) => void;

    selectedRows: number[];
    onRevertSelected: () => void;
};

export function StockMovementToolbar({
    search,
    setSearch,
    filter,
    setFilter,
    selectedRows,
    onRevertSelected,
}: StockMovementToolbarProps) {

    return (
        <div className="flex items-center justify-between gap-4">

            {/* Search */}

            <div className="relative w-full max-w-sm">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>


            {/* Actions */}

            <div className="flex items-center gap-2">

                {/* Filter */}

                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button
                            variant="outline"
                            className="gap-2"
                        >

                            <Filter className="h-4 w-4" />

                            Filter

                        </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuItem
                            onClick={() => setFilter("all")}
                        >
                            All
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("CREATED")}
                        >
                            Created
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("EDITED")}
                        >
                            Edited
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("ARCHIVED")}
                        >
                            Archived
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("DUPLICATED")}
                        >
                            Duplicated
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("STOCK_IN")}
                        >
                            Stock In
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("STOCK_OUT")}
                        >
                            Stock Out
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setFilter("STOCK_ADJUSTMENT")}
                        >
                            Stock Adjustment
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>


                {/* Revert */}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedRows.length === 0}
                    onClick={onRevertSelected}
                    className="gap-2"
                >

                    <RotateCcw className="h-4 w-4" />

                    Revert Selected

                </Button>

            </div>

        </div>
    );
} 