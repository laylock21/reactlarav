import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Pencil, Plus, Search, Tag as TagIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Tag = {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
};

type Props = {
    tags: {
        data: Tag[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: { search?: string };
};

export default function Tags({ tags: tagList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [tagsData, setTagsData] = useState(tagList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
    const [name, setName] = useState("");

    useEffect(() => setTagsData(tagList.data), [tagList.data]);

    const filteredTags = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? tagsData.filter((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(value))
            : tagsData;
    }, [tagsData, search]);

    const allSelected = filteredTags.length > 0 && selectedRows.length === filteredTags.length;
    const toggleAll = (checked: boolean | "indeterminate") =>
        setSelectedRows(checked ? filteredTags.map((tag) => tag.id) : []);
    const toggleRow = (id: number, checked: boolean | "indeterminate") =>
        setSelectedRows((current) => (checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id)));

    const openCreate = () => { setEditingTag(null); setName(""); setFormOpen(true); };
    const openEdit = (tag: Tag) => { setEditingTag(tag); setName(tag.name); setFormOpen(true); };

    const saveTag = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingTag(null);
                setName("");
                toast.success(editingTag ? "Tag updated successfully." : "Tag added successfully.");
            },
            onError: () => toast.error("Unable to save tag. The name may already be taken."),
        };
        editingTag ? router.put(`/tags/${editingTag.id}`, { name }, options) : router.post("/tags", { name }, options);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/tags/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setTagsData((prev) => prev.filter((tag) => tag.id !== deleteTarget.id));
                    setDeleteOpen(false);
                    setDeleteTarget(null);
                    toast.success("Tag deleted successfully.");
                },
                onError: () => toast.error("This tag cannot be deleted."),
            });
            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];
            ids.forEach((id) => router.delete(`/tags/${id}`, { preserveScroll: true }));
            setTagsData((prev) => prev.filter((tag) => !ids.includes(tag.id)));
            setSelectedRows([]);
            setDeleteOpen(false);
            toast.success(`${ids.length} tags deleted successfully.`);
        }
    };

    return (
        <>
            <Head title="Tags" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Tags</h1>
                        <p className="text-muted-foreground">Organize products with tags.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tags..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get("/tags", { search: value }, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => { setDeleteTarget(null); setDeleteOpen(true); }}
                                    className="transition-colors duration-300 ease-out"
                                >
                                    <Trash2 className={`mr-2 h-4 w-4 transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`} />
                                    <span className={`transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`}>
                                        Delete
                                    </span>
                                </Button>
                                <Button onClick={openCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Tag
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead className="w-12">
                                                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all tags" />
                                            </TableHead>
                                            <TableHead className="w-12" />
                                            <TableHead>Name</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead className="text-right">Products</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTags.map((tag) => (
                                            <TableRow key={tag.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(tag.id)}
                                                        onCheckedChange={(checked) => toggleRow(tag.id, checked)}
                                                        aria-label={`Select ${tag.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label={`Actions for ${tag.name}`}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                                                            <DropdownMenuItem onClick={() => openEdit(tag)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Tag
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => { setDeleteTarget(tag); setDeleteOpen(true); }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <span className="flex items-center gap-2">
                                                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                                                        {tag.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{tag.slug}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{tag.products_count ?? 0}</TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredTags.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                    No tags found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Go to page</span>
                        <select
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                            value={tagList.current_page}
                            onChange={(e) => router.get(`/tags?page=${e.target.value}`)}
                        >
                            {Array.from({ length: tagList.last_page }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" disabled={tagList.current_page === 1} onClick={() => tagList.prev_page_url && router.get(tagList.prev_page_url)}>
                            Previous
                        </Button>
                        {Array.from({ length: Math.max(tagList.last_page, 5) }, (_, i) => (
                            <Button
                                key={i}
                                variant={tagList.current_page === i + 1 ? "default" : "outline"}
                                disabled={i + 1 > tagList.last_page}
                                onClick={() => router.get(`/tags?page=${i + 1}`)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button variant="outline" disabled={tagList.current_page === tagList.last_page} onClick={() => tagList.next_page_url && router.get(tagList.next_page_url)}>
                            Next
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {tagList.current_page} of {tagList.last_page}
                    </div>
                </div>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTag ? "Edit Tag" : "Add Tag"}</DialogTitle>
                        <DialogDescription>The URL slug is generated automatically.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="tag-name">Name</Label>
                        <Input id="tag-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Tag name" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveTag} disabled={!name.trim()}>
                            {editingTag ? "Save Changes" : "Add Tag"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Tag</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.name}"? It will be removed from all products.`
                                : `Delete ${selectedRows.length} selected tags? They will be removed from all products.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Tags.layout = {
    breadcrumbs: [{ title: "Tags", href: "/tags" }],
};
