import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Category } from "./categories-types";

type Props = {
    categories: Category[];
    selectedRows: number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
};

export function CategoriesTable({ categories, selectedRows, setSelectedRows, onEdit, onDelete }: Props) {
    const allSelected = categories.length > 0 && selectedRows.length === categories.length;
    const toggleAll = (checked: boolean | "indeterminate") => setSelectedRows(checked ? categories.map((category) => category.id) : []);
    const toggleRow = (id: number, checked: boolean | "indeterminate") => setSelectedRows((current) => checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id));

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
            <div className="min-h-0 flex-1 overflow-auto">
            <Table>
                <TableHeader><TableRow>
                    <TableHead className="w-12"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all categories" /></TableHead>
                    <TableHead>Name</TableHead><TableHead>Parent category</TableHead><TableHead>Description</TableHead><TableHead className="w-16" />
                </TableRow></TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell><Checkbox checked={selectedRows.includes(category.id)} onCheckedChange={(checked) => toggleRow(category.id, checked)} aria-label={`Select ${category.name}`} /></TableCell>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>{category.parent ? <Badge variant="secondary">{category.parent.name}</Badge> : <span className="text-sm text-muted-foreground">Top-level category</span>}</TableCell>
                            <TableCell className="max-w-md truncate text-muted-foreground">{category.description || "—"}</TableCell>
                            <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${category.name}`}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => onEdit(category)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive" onClick={() => onDelete(category)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
                        </TableRow>
                    ))}
                    {categories.length === 0 && <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No categories found.</TableCell></TableRow>}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}
