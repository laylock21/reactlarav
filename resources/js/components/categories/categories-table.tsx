import React from "react";
import {
    ChevronDown,
    ChevronRight,
    Eye,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import type {
    Category,
    SubCategory,
    Tag,
} from "./categories-types";

type Props = {
    categories: Category[];

    selectedRows: number[];

    setSelectedRows: React.Dispatch<
        React.SetStateAction<number[]>
    >;

    onView: (category: Category) => void;

    onEdit: (category: Category) => void;

    onDelete: (category: Category) => void;

    onAddSubCategory: (category: Category) => void;

    onAddTag: (
        subCategory: SubCategory
    ) => void;

    expandedCategories: number[];

    onToggleCategory: (
        categoryId: number
    ) => void;
};

export function CategoriesTable({
    categories,
    selectedRows,
    setSelectedRows,
    onView,
    onEdit,
    onDelete,
    onAddSubCategory,
    expandedCategories,
    onToggleCategory,
    onAddTag,
}: Props) {
    /*
    |--------------------------------------------------------------------------
    | Select All
    |--------------------------------------------------------------------------
    */

    const allSelected =
        categories.length > 0 &&
        selectedRows.length === categories.length;

    const handleSelectAll = (
        checked: boolean | "indeterminate"
    ) => {
        if (checked) {
            setSelectedRows(
                categories.map(
                    (category) => category.id
                )
            );

            return;
        }

        setSelectedRows([]);
    };

    /*
    |--------------------------------------------------------------------------
    | Select Category
    |--------------------------------------------------------------------------
    */

    const handleSelect = (
        checked: boolean | "indeterminate",
        id: number
    ) => {
        if (checked) {
            setSelectedRows((prev) => [
                ...new Set([
                    ...prev,
                    id,
                ]),
            ]);

            return;
        }

        setSelectedRows((prev) =>
            prev.filter(
                (item) => item !== id
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render Tags
    |--------------------------------------------------------------------------
    */

    const renderTags = (
        subCategory: SubCategory
    ) => {
        if (
            !subCategory.tags ||
            subCategory.tags.length === 0
        ) {
            return (
                <span className="text-sm text-muted-foreground">
                    No tags
                </span>
            );
        }

        return (
            <div className="flex flex-wrap gap-2">
                {subCategory.tags.map(
                    (tag: Tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="rounded-full px-3 py-1"
                        >
                            {tag.name}
                        </Badge>
                    )
                )}
            </div>
        );
    };

    return (
        <div className="h-full overflow-x-auto">

            <div className="min-w-full overflow-y-auto">

                <Table>

                    {/* TABLE HEADER */}

                    <TableHeader
                        className="
                            sticky
                            top-0
                            z-10
                            bg-background
                        "
                    >

                        <TableRow>

                            <TableHead className="w-12">

                                <Checkbox
                                    checked={
                                        allSelected
                                    }
                                    onCheckedChange={
                                        handleSelectAll
                                    }
                                />

                            </TableHead>

                            <TableHead>
                                Category
                            </TableHead>

                            <TableHead>
                                Description
                            </TableHead>

                            <TableHead>
                                Created
                            </TableHead>

                            <TableHead className="w-12" />

                        </TableRow>

                    </TableHeader>

                    {/* TABLE BODY */}

                    <TableBody>

                        {categories.map(
                            (category) => {

                                const expanded =
                                    expandedCategories.includes(
                                        category.id
                                    );

                                const subCategories =
                                    category.sub_categories ??
                                    [];

                                return (
                                    <React.Fragment
                                        key={
                                            category.id
                                        }
                                    >

                                        {/* CATEGORY ROW */}

                                        <TableRow>

                                            <TableCell>

                                                <Checkbox
                                                    checked={selectedRows.includes(
                                                        category.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelect(
                                                            checked,
                                                            category.id
                                                        )
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <div className="flex items-center gap-2">

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() =>
                                                            onToggleCategory(
                                                                category.id
                                                            )
                                                        }
                                                    >
                                                        {expanded ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>

                                                    <span className="font-semibold">
                                                        {
                                                            category.name
                                                        }
                                                    </span>

                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2"
                                                    >
                                                        {
                                                            subCategories.length
                                                        }{" "}
                                                        sub
                                                    </Badge>

                                                </div>

                                            </TableCell>

                                            <TableCell className="text-muted-foreground">

                                                {
                                                    category.description ||
                                                    "—"
                                                }

                                            </TableCell>

                                            <TableCell>

                                                {new Date(
                                                    category.created_at
                                                ).toLocaleDateString()}

                                            </TableCell>

                                            <TableCell>

                                                <DropdownMenu>

                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>

                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent>

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onView(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onEdit(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() =>
                                                                onDelete(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>

                                                    </DropdownMenuContent>

                                                </DropdownMenu>

                                            </TableCell>

                                        </TableRow>

                                        {/* SUB-CATEGORIES */}

                                        {expanded &&
                                            subCategories.map(
                                                (
                                                    subCategory: SubCategory
                                                ) => (
                                                    <TableRow
                                                        key={
                                                            `sub-${subCategory.id}`
                                                        }
                                                        className="bg-muted/30"
                                                    >

                                                        <TableCell />

                                                        <TableCell
                                                            colSpan={
                                                                2
                                                            }
                                                        >

                                                            <div className="ml-10">

                                                                <div className="flex items-center gap-2">

                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            subCategory.name
                                                                        }
                                                                    </span>

                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            subCategory.tags?.length ??
                                                                            0
                                                                        }{" "}
                                                                        tags
                                                                    </Badge>

                                                                </div>

                                                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                                                    {renderTags(
                                                                        subCategory
                                                                    )}

                                                                </div>

                                                            </div>

                                                        </TableCell>

                                                        <TableCell>

                                                            <div className="flex items-center justify-between">

                                                                <span>
                                                                    {subCategory.name}
                                                                </span>

                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        onAddTag(subCategory)
                                                                    }
                                                                >
                                                                    + Tag
                                                                </Button>

                                                            </div>

                                                        </TableCell>

                                                        <TableCell />

                                                    </TableRow>
                                                )
                                            )}

                                        {/* ADD SUB-CATEGORY */}

                                        {expanded && (
                                            <TableRow
                                                className="bg-muted/20"
                                            >

                                                <TableCell />

                                                <TableCell
                                                    colSpan={
                                                        4
                                                    }
                                                >

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="ml-10"
                                                        onClick={() =>
                                                            onAddSubCategory(category)
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Sub-category
                                                    </Button>

                                                </TableCell>

                                            </TableRow>
                                        )}

                                    </React.Fragment>
                                );
                            }
                        )}

                        {/* EMPTY STATE */}

                        {categories.length === 0 && (
                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    className="
                                        h-32
                                        text-center
                                        text-muted-foreground
                                    "
                                >
                                    No categories found.
                                </TableCell>

                            </TableRow>
                        )}

                    </TableBody>

                </Table>

            </div>

        </div>
    );
}