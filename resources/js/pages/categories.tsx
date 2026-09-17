import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CategoriesPagination } from "@/components/categories/categories-pagination";
import { CategoriesTable } from "@/components/categories/categories-table";
import { CategoriesToolbar } from "@/components/categories/categories-toolbar";
import { emptyCategoryForm, type Category, type CategoryForm } from "@/components/categories/categories-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = { categories: { data: Category[]; current_page: number; last_page: number; prev_page_url: string | null; next_page_url: string | null }; filters?: { search?: string } };

export default function Categories({ categories: categoryList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [categories, setCategories] = useState(categoryList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [form, setForm] = useState<CategoryForm>(emptyCategoryForm);

    useEffect(() => setCategories(categoryList.data), [categoryList.data]);
    const filteredCategories = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value ? categories.filter((category) => [category.name, category.description ?? "", category.parent?.name ?? ""].join(" ").toLowerCase().includes(value)) : categories;
    }, [categories, search]);

    const openCreate = () => { setEditingCategory(null); setForm(emptyCategoryForm); setFormOpen(true); };
    const openEdit = (category: Category) => { setEditingCategory(category); setForm({ name: category.name, parent_id: category.parent_id, description: category.description ?? "" }); setFormOpen(true); };
    const saveCategory = () => {
        const options = { preserveScroll: true, onSuccess: () => { setFormOpen(false); setForm(emptyCategoryForm); toast.success(editingCategory ? "Category updated successfully." : "Category added successfully."); }, onError: () => toast.error("Unable to save category. Check the name and selected parent.") };
        editingCategory ? router.put(`/categories/${editingCategory.id}`, form, options) : router.post("/categories", form, options);
    };
    const requestDelete = (category: Category | null) => { setDeleteTarget(category); setDeleteOpen(true); };
    const deleteCategories = () => {
        const ids = deleteTarget ? [deleteTarget.id] : selectedRows;
        ids.forEach((id) => router.delete(`/categories/${id}`, {
            preserveScroll: true,
            onError: () => toast.error("A category assigned to products cannot be deleted."),
        }));
        setSelectedRows([]); setDeleteOpen(false); setDeleteTarget(null);
        toast.success(ids.length === 1 ? "Category deleted successfully." : `${ids.length} categories deleted successfully.`);
    };
    const parentOptions = categories.filter((category) => category.parent_id === null && category.id !== editingCategory?.id);

    return <><Head title="Categories" /><div className="flex h-screen flex-col space-y-6 overflow-hidden p-6"><div className="shrink-0"><h1 className="text-3xl font-bold">Categories</h1><p className="text-muted-foreground">Manage top-level categories and their subcategories.</p></div><Card className="flex min-h-0 flex-1 flex-col overflow-hidden"><CardHeader className="shrink-0 px-6 py-5"><CategoriesToolbar search={search} setSearch={setSearch} selectedRows={selectedRows} setDeleteOpen={setDeleteOpen} setDeleteTarget={() => setDeleteTarget(null)} onAddCategory={openCreate} /></CardHeader><CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 pb-6"><CategoriesTable categories={filteredCategories} selectedRows={selectedRows} setSelectedRows={setSelectedRows} onEdit={openEdit} onDelete={requestDelete} /><CategoriesPagination currentPage={categoryList.current_page} lastPage={categoryList.last_page} prevPageUrl={categoryList.prev_page_url} nextPageUrl={categoryList.next_page_url} /></CardContent></Card></div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle><DialogDescription>Create a category or select a parent to make it a subcategory.</DialogDescription></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Category name" /></div><div className="space-y-2"><Label htmlFor="category-parent">Parent category <span className="text-muted-foreground">(optional)</span></Label><Select value={form.parent_id?.toString() ?? "none"} onValueChange={(value) => setForm({ ...form, parent_id: value === "none" ? null : Number(value) })}><SelectTrigger id="category-parent"><SelectValue placeholder="No parent category" /></SelectTrigger><SelectContent><SelectItem value="none">No parent category</SelectItem>{parentOptions.map((category) => <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="category-description">Description</Label><Textarea id="category-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" /></div></div><DialogFooter><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button onClick={saveCategory} disabled={!form.name.trim()}>{editingCategory ? "Save Changes" : "Add Category"}</Button></DialogFooter></DialogContent></Dialog>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Delete category</DialogTitle><DialogDescription>{deleteTarget ? `Delete ${deleteTarget.name}?` : `Delete ${selectedRows.length} selected categories?`}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteCategories}>Delete</Button></DialogFooter></DialogContent></Dialog></>;
}

Categories.layout = {
    breadcrumbs: [{ title: "Categories", href: "/categories" }],
};
