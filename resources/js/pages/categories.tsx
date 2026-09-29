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
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [form, setForm] = useState<CategoryForm>(emptyCategoryForm);

    useEffect(() => setCategories(categoryList.data), [categoryList.data]);
    const filteredCategories = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? categories.filter((category) =>
                [category.name, category.description ?? "", ...(category.children ?? []).map((child) => `${child.name} ${child.description ?? ""}`)]
                    .join(" ")
                    .toLowerCase()
                    .includes(value)
            )
            : categories;
    }, [categories, search]);

    const openCreate = () => { setEditingCategory(null); setForm(emptyCategoryForm); setFormOpen(true); };
    const openCreateSubcategory = (parent: Category) => { setEditingCategory(null); setForm({ ...emptyCategoryForm, parent_id: parent.id }); setFormOpen(true); };
    const openEdit = (category: Category) => { setEditingCategory(category); setForm({ name: category.name, parent_id: category.parent_id, description: category.description ?? "" }); setFormOpen(true); };
    const saveCategory = () => {
        const options = { preserveScroll: true, onSuccess: () => { setFormOpen(false); setForm(emptyCategoryForm); toast.success(editingCategory ? "Category updated successfully." : "Category added successfully."); }, onError: () => toast.error("Unable to save category. Check the name and selected parent.") };
        editingCategory ? router.put(`/categories/${editingCategory.id}`, form, options) : router.post("/categories", form, options);
    };
    const toggleCategory = (category: Category) => setExpandedId((current) => (current === category.id ? null : category.id));
    const requestDelete = (category: Category) => { setDeleteTarget(category); setDeleteOpen(true); };
    const deleteCategory = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/categories/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeleteTarget(null);
                toast.success("Category deleted successfully.");
            },
            onError: (errors: Record<string, string>) => toast.error(errors.category ?? "This category cannot be deleted because it still has subcategories or products."),
        });
    };
    const parentOptions = categories.filter((category) => category.parent_id === null && category.id !== editingCategory?.id);

    return (
        <>
            <Head title="Categories" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Categories</h1>
                        <p className="text-muted-foreground">Manage top-level categories and their subcategories.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <CategoriesToolbar search={search} setSearch={setSearch} onAddCategory={openCreate} />
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <CategoriesTable
                            categories={filteredCategories}
                            expandedId={expandedId}
                            onToggle={toggleCategory}
                            onEdit={openEdit}
                            onDelete={requestDelete}
                            onAddSubcategory={openCreateSubcategory}
                        />
                    </CardContent>
                </Card>
                <CategoriesPagination
                    currentPage={categoryList.current_page}
                    lastPage={categoryList.last_page}
                    prevPageUrl={categoryList.prev_page_url}
                    nextPageUrl={categoryList.next_page_url}
                />
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle><DialogDescription>Create a category or select a parent to make it a subcategory.</DialogDescription></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Category name" /></div><div className="space-y-2"><Label htmlFor="category-parent">Parent category <span className="text-muted-foreground">(optional)</span></Label><Select value={form.parent_id?.toString() ?? "none"} onValueChange={(value) => setForm({ ...form, parent_id: value === "none" ? null : Number(value) })}><SelectTrigger id="category-parent"><SelectValue placeholder="No parent category" /></SelectTrigger><SelectContent><SelectItem value="none">No parent category</SelectItem>{parentOptions.map((category) => <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="category-description">Description</Label><Textarea id="category-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" /></div></div><DialogFooter><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button onClick={saveCategory} disabled={!form.name.trim()}>{editingCategory ? "Save Changes" : "Add Category"}</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Delete category</DialogTitle><DialogDescription>{deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete this category?"}{deleteTarget && ((deleteTarget.children_count ?? 0) > 0 || (deleteTarget.products_count ?? 0) > 0) ? ` This category has ${deleteTarget.children_count ?? 0} subcategories and ${deleteTarget.products_count ?? 0} products assigned. It cannot be deleted until they are moved or removed.` : ""}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteCategory}>Delete</Button></DialogFooter></DialogContent></Dialog>
        </>
    );
}

Categories.layout = {
    breadcrumbs: [{ title: "Categories", href: "/categories" }],
};
