import {
    Eye,
    MoreVertical,
    Pencil,
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

import type { Category } from "./categories-types";

type Props = {
    categories: Category[];

    selectedRows: number[];

    setSelectedRows: React.Dispatch<
        React.SetStateAction<number[]>
    >;

    onView: (category: Category) => void;

    onEdit: (category: Category) => void;

    onDelete: (category: Category) => void;
};

export function CategoriesTable({
    categories,
    selectedRows,
    setSelectedRows,
    onView,
    onEdit,
    onDelete,
}: Props) {
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
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelect = (
        checked: boolean | "indeterminate",
        id: number
    ) => {
        if (checked) {
            setSelectedRows((prev) => [
                ...prev,
                id,
            ]);
        } else {
            setSelectedRows((prev) =>
                prev.filter(
                    (item) => item !== id
                )
            );
        }
    };

    return (
        <div className="h-full overflow-x-auto">

            <div className="min-w-full overflow-y-auto">

                <Table>

                    <TableHeader className="
                        sticky
                        top-0
                        z-10
                        bg-background
                    ">

                        <TableRow>

                            <TableHead className="w-12">

                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={
                                        handleSelectAll
                                    }
                                />

                            </TableHead>

                            <TableHead className="w-12" />

                            <TableHead>
                                Category
                            </TableHead>

                            <TableHead>
                                Description
                            </TableHead>

                            <TableHead>
                                Created
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {categories.map(
                            (category) => (
                                <TableRow
                                    key={category.id}
                                >

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

                                    <TableCell className="font-medium">

                                        {category.name}

                                    </TableCell>

                                    <TableCell className="text-muted-foreground">

                                        {category.description ||
                                            "—"}

                                    </TableCell>

                                    <TableCell>

                                        {new Date(
                                            category.created_at
                                        ).toLocaleDateString()}

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </div>

        </div>
    );
}