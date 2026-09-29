import { Fragment } from "react";
import { ChevronDown, ChevronRight, CornerDownRight, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Category } from "./categories-types";

type Props = {
    categories: Category[];
    expandedId: number | null;
    onToggle: (category: Category) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onAddSubcategory: (parent: Category) => void;
};

function ActionsCell({ category, onEdit, onDelete }: { category: Category; onEdit: (category: Category) => void; onDelete: (category: Category) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Actions for ${category.name}`} onClick={(event) => event.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(category)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function CategoriesTable({ categories, expandedId, onToggle, onEdit, onDelete, onAddSubcategory }: Props) {
    const visibleCategories = expandedId ? categories.filter((category) => category.id === expandedId) : categories;

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
            <div className="min-h-0 flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10" />
                            <TableHead>Name</TableHead>
                            <TableHead>Subcategories</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-16" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleCategories.map((category) => {
                            const isExpanded = expandedId === category.id;
                            const subcategories = category.children ?? [];
                            const subcategoryCount = category.children_count ?? subcategories.length;

                            return (
                                <Fragment key={category.id}>
                                    <TableRow
                                        className={`cursor-pointer ${isExpanded ? "bg-muted/30" : ""}`}
                                        onClick={() => onToggle(category)}
                                    >
                                        <TableCell>
                                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            {subcategoryCount > 0 ? (
                                                <Badge variant="secondary">
                                                    {subcategoryCount} {subcategoryCount === 1 ? "subcategory" : "subcategories"}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No subcategories</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate text-muted-foreground">{category.description || "—"}</TableCell>
                                        <TableCell onClick={(event) => event.stopPropagation()}>
                                            <ActionsCell category={category} onEdit={onEdit} onDelete={onDelete} />
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow
                                            className="cursor-pointer border-dashed bg-muted/30 hover:bg-muted/50"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onAddSubcategory(category);
                                            }}
                                        >
                                            <TableCell />
                                            <TableCell>
                                                <span className="flex items-center gap-2 pl-2 font-medium text-muted-foreground">
                                                    <Plus className="h-4 w-4" />
                                                    Add subcategory under {category.name}
                                                </span>
                                            </TableCell>
                                            <TableCell />
                                            <TableCell />
                                            <TableCell />
                                        </TableRow>
                                    )}
                                    {isExpanded &&
                                        subcategories.map((subcategory) => (
                                            <TableRow key={subcategory.id} className="bg-muted/50 hover:bg-muted/70">
                                                <TableCell />
                                                <TableCell>
                                                    <span className="flex items-center gap-2 pl-2">
                                                        <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                                                        {subcategory.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {(subcategory.products_count ?? 0) > 0
                                                            ? `${subcategory.products_count} ${(subcategory.products_count ?? 0) === 1 ? "product" : "products"}`
                                                            : "No products"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-md truncate text-muted-foreground">{subcategory.description || "—"}</TableCell>
                                                <TableCell>
                                                    <ActionsCell category={subcategory} onEdit={onEdit} onDelete={onDelete} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </Fragment>
                            );
                        })}
                        {visibleCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
