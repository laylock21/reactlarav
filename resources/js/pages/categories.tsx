import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CategoriesToolbar } from "@/components/categories/categories-toolbar";
import { CategoriesTable } from "@/components/categories/categories-table";
import { CategoriesPagination } from "@/components/categories/categories-pagination";

import type {
    Category,
    CategoryForm,
    SubCategory,
    SubCategoryForm,
    Tag,
    TagForm,
} from "@/components/categories/categories-types";

import {
    emptyCategoryForm,
    emptySubCategoryForm,
    emptyTagForm,
} from "@/components/categories/categories-types";

type Props = {
    categories: {
        data: Category[];

        current_page: number;

        last_page: number;

        prev_page_url: string | null;

        next_page_url: string | null;
    };

    filters?: {
        search?: string;
    };
};

export default function Categories({
    categories: categoryList,
    filters,
}: Props) {
    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState(
        filters?.search ?? ""
    );

    /*
    |--------------------------------------------------------------------------
    | Product Data
    |--------------------------------------------------------------------------
    */

    const [categoriesData, setCategoriesData] =
        useState<Category[]>(
            categoryList.data
        );

    /*
    |--------------------------------------------------------------------------
    | Selected Rows
    |--------------------------------------------------------------------------
    */

    const [selectedRows, setSelectedRows] =
        useState<number[]>([]);

    /*
    |--------------------------------------------------------------------------
    | Dialog
    |--------------------------------------------------------------------------
    */

    const [open, setOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState<number | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Sub-category Dialog
    |--------------------------------------------------------------------------
    */

    const [subCategoryOpen, setSubCategoryOpen] =
        useState(false);

    const [subCategoryCategory, setSubCategoryCategory] =
        useState<Category | null>(null);

    const [subCategoryName, setSubCategoryName] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Tag Dialog
    |--------------------------------------------------------------------------
    */

    const [tagSubCategory, setTagSubCategory] =
        useState<SubCategory | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Editing
    |--------------------------------------------------------------------------
    */

    const [editingCategory, setEditingCategory] =
        useState<number | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const [form, setForm] =
        useState<CategoryForm>(
            emptyCategoryForm
        );
    
    /*
    |--------------------------------------------------------------------------
    | Tag Dialog
    |--------------------------------------------------------------------------
    */

    const [tagOpen, setTagOpen] =
        useState(false);

    const [selectedSubCategory, setSelectedSubCategory] =
        useState<number | null>(null);

    const [tagName, setTagName] =
        useState("");
    /*
    |--------------------------------------------------------------------------
    | Sub-category
    |--------------------------------------------------------------------------
    */

    const [subCategoryForm, setSubCategoryForm] =
        useState<SubCategoryForm>(
            emptySubCategoryForm
        );

    const [editingSubCategory, setEditingSubCategory] =
        useState<number | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Tag
    |--------------------------------------------------------------------------
    */

    const [tagForm, setTagForm] =
        useState<TagForm>(
            emptyTagForm
        );

    const [editingTag, setEditingTag] =
        useState<number | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Expanded Categories
    |--------------------------------------------------------------------------
    */

    const [expandedCategories, setExpandedCategories] =
        useState<number[]>([]);

    /*
    |--------------------------------------------------------------------------
    | Synchronize Backend Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setCategoriesData(
            categoryList.data
        );
    }, [categoryList.data]);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredCategories =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return categoriesData;
            }

            return categoriesData.filter(
                (category) =>
                    [
                        category.name,
                        category.description ?? "",
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(keyword)
            );

        }, [
            categoriesData,
            search,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Save Category
    |--------------------------------------------------------------------------
    */

    const saveCategory = () => {

        if (editingCategory) {

            router.put(
                `/categories/${editingCategory}`,
                form,
                {
                    preserveScroll: true,

                    onSuccess: () => {

                        setOpen(false);

                        setEditingCategory(null);

                        setForm(
                            emptyCategoryForm
                        );

                        toast.success(
                            "Changes saved.",
                            {
                                description:
                                    "The category has been updated successfully.",
                            }
                        );
                    },

                    onError: () => {

                        toast.error(
                            "Unable to update category.",
                            {
                                description:
                                    "There was an error while updating the category.",
                            }
                        );
                    },
                }
            );

            return;
        }

        router.post(
            "/categories",
            form,
            {
                preserveScroll: true,

                onSuccess: () => {

                    setOpen(false);

                    setForm(
                        emptyCategoryForm
                    );

                    toast.success(
                        "Category added successfully.",
                        {
                            description:
                                "The category has been added successfully.",
                        }
                    );
                },

                onError: () => {

                    toast.error(
                        "Unable to add category.",
                        {
                            description:
                                "There was an error while adding the category.",
                        }
                    );
                },
            }
        );
    };
    /*
    |--------------------------------------------------------------------------
    | Save Sub-category
    |--------------------------------------------------------------------------
    */

    const saveSubCategory = () => {

        if (
            !subCategoryForm.category_id
        ) {
            toast.error(
                "Category is required."
            );

            return;
        }

        if (editingSubCategory) {

            router.put(
                `/sub-categories/${editingSubCategory}`,
                {
                    name: subCategoryForm.name,
                    description:
                        subCategoryForm.description,
                },
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setEditingSubCategory(null);

                        setSubCategoryForm(
                            emptySubCategoryForm
                        );

                        toast.success(
                            "Sub-category updated successfully."
                        );
                    },

                    onError: () => {
                        toast.error(
                            "Unable to update sub-category."
                        );
                    },
                }
            );

            return;
        }

        router.post(
            `/categories/${subCategoryForm.category_id}/sub-categories`,
            {
                name: subCategoryForm.name,
                description:
                    subCategoryForm.description,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setSubCategoryForm(
                        emptySubCategoryForm
                    );

                    toast.success(
                        "Sub-category added successfully."
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to add sub-category."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Save Tag
    |--------------------------------------------------------------------------
    */

    const saveTag = () => {

        if (
            !tagForm.sub_category_id
        ) {
            toast.error(
                "Sub-category is required."
            );

            return;
        }

        if (editingTag) {

            router.put(
                `/tags/${editingTag}`,
                {
                    name: tagForm.name,
                },
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setEditingTag(null);

                        setTagForm(
                            emptyTagForm
                        );

                        toast.success(
                            "Tag updated successfully."
                        );
                    },

                    onError: () => {
                        toast.error(
                            "Unable to update tag."
                        );
                    },
                }
            );

            return;
        }

        router.post(
            `/sub-categories/${tagForm.sub_category_id}/tags`,
            {
                name: tagForm.name,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setTagForm(
                        emptyTagForm
                    );

                    toast.success(
                        "Tag added successfully."
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to add tag."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Sub-category
    |--------------------------------------------------------------------------
    */

    const deleteSubCategory = (
        subCategory: SubCategory
    ) => {

        router.delete(
            `/sub-categories/${subCategory.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {

                    toast.success(
                        "Sub-category deleted successfully."
                    );
                },

                onError: () => {

                    toast.error(
                        "Unable to delete sub-category."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Tag
    |--------------------------------------------------------------------------
    */

    const deleteTag = (
        tag: Tag
    ) => {

        router.delete(
            `/tags/${tag.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {

                    toast.success(
                        "Tag deleted successfully."
                    );
                },

                onError: () => {

                    toast.error(
                        "Unable to delete tag."
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Category
    |--------------------------------------------------------------------------
    */

    const deleteCategory = (
        category: Category
    ) => {

        router.delete(
            `/categories/${category.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {

                    setCategoriesData(
                        (prev) =>
                            prev.filter(
                                (item) =>
                                    item.id !==
                                    category.id
                            )
                    );

                    toast.success(
                        "Category deleted successfully.",
                        {
                            description:
                                "The category has been permanently deleted.",
                        }
                    );
                },

                onError: () => {

                    toast.error(
                        "Unable to delete category.",
                        {
                            description:
                                "There was an error while deleting the category.",
                        }
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Bulk Delete
    |--------------------------------------------------------------------------
    */

    const deleteSelected = () => {

        if (
            selectedRows.length === 0
        ) {
            return;
        }

        const ids = [
            ...selectedRows,
        ];

        ids.forEach((id) => {

            router.delete(
                `/categories/${id}`,
                {
                    preserveScroll: true,
                }
            );

        });

        setCategoriesData(
            (prev) =>
                prev.filter(
                    (category) =>
                        !ids.includes(
                            category.id
                        )
                )
        );

        setSelectedRows([]);

        setDeleteOpen(false);

        toast.success(
            `${ids.length} categories deleted successfully.`,
            {
                description:
                    "The selected categories have been permanently deleted.",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | View
    |--------------------------------------------------------------------------
    */

    const viewCategory = (
        category: Category
    ) => {

        toast.info(
            category.name,
            {
                description:
                    category.description ||
                    "No description.",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Toggle Category
    |--------------------------------------------------------------------------
    */

    const toggleCategory = (
        categoryId: number
    ) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter(
                    (id) => id !== categoryId
                )
                : [
                    ...prev,
                    categoryId,
                ]
        );
    };
    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const editCategory = (
        category: Category
    ) => {

        setEditingCategory(
            category.id
        );

        setForm({
            name: category.name,

            description:
                category.description ??
                "",
        });

        setOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Categories" />

            <div className="
                flex
                h-screen
                flex-col
                space-y-6
                overflow-hidden
                p-6
            ">

                {/* HEADER */}

                <div className="shrink-0">

                    <h1 className="text-3xl font-bold">
                        Categories
                    </h1>

                    <p className="text-muted-foreground">
                        Manage inventory product categories.
                    </p>

                </div>

                {/* CARD */}

                <Card className="
                    flex
                    min-h-0
                    flex-1
                    flex-col
                    overflow-hidden
                ">

                    {/* TOOLBAR */}

                    <CardHeader className="
                        shrink-0
                        px-6
                        py-5
                    ">

                        <CategoriesToolbar
                            search={search}
                            setSearch={setSearch}
                            selectedRows={
                                selectedRows
                            }
                            setOpen={setOpen}
                            setDeleteOpen={
                                setDeleteOpen
                            }
                            setDeleteTarget={
                                setDeleteTarget
                            }
                            setEditingCategory={
                                setEditingCategory
                            }
                        />

                    </CardHeader>

                    {/* TABLE */}

                    <CardContent className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        overflow-hidden
                    ">

                        <CategoriesTable
                            categories={
                                filteredCategories
                            }
                            selectedRows={
                                selectedRows
                            }
                            setSelectedRows={
                                setSelectedRows
                            }
                            onView={
                                viewCategory
                            }
                            onEdit={
                                editCategory
                            }
                            onDelete={
                                deleteCategory
                            }
                            expandedCategories={
                                expandedCategories
                            }
                            onToggleCategory={
                                toggleCategory
                            }

                            onAddSubCategory={
                                (category) => {
                                    setSubCategoryCategory(
                                        category
                                    );

                                    setSubCategoryName("");

                                    setSubCategoryOpen(true);
                                }
                            }

                            onAddTag={
                                (subCategory) => {
                                    setTagSubCategory(
                                        subCategory
                                    );

                                    setTagName("");

                                    setTagOpen(true);
                                }
                            }
                        />

                        {/* PAGINATION */}

                        <CategoriesPagination
                            currentPage={
                                categoryList.current_page
                            }
                            lastPage={
                                categoryList.last_page
                            }
                            prevPageUrl={
                                categoryList.prev_page_url
                            }
                            nextPageUrl={
                                categoryList.next_page_url
                            }
                        />

                    </CardContent>

                </Card>

            </div>

            {/* CATEGORY DIALOG */}

            <Dialog
                open={open}
                onOpenChange={setOpen}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            {editingCategory
                                ? "Edit Category"
                                : "Add Category"}
                        </DialogTitle>

                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information."
                                : "Create a new inventory category."}
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <Input
                            placeholder="Category name"
                            value={form.name}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    name:
                                        event.target
                                            .value,
                                })
                            }
                        />

                        <Textarea
                            placeholder="Description"
                            value={
                                form.description
                            }
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    description:
                                        event.target
                                            .value,
                                })
                            }
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={
                                saveCategory
                            }
                        >
                            {editingCategory
                                ? "Save Changes"
                                : "Add Category"}
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

            {/* TAG DIALOG */}

            <Dialog
                open={tagOpen}
                onOpenChange={setTagOpen}
            >
                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Tag
                        </DialogTitle>

                        <DialogDescription>
                            Add a tag to this sub-category.
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <Input
                            placeholder="Tag name"
                            value={tagName}
                            onChange={(event) =>
                                setTagName(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setTagOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={saveTag}
                            disabled={
                                !tagName.trim() ||
                                !selectedSubCategory
                            }
                        >
                            Add Tag
                        </Button>

                    </DialogFooter>

                </DialogContent>
            </Dialog>

            {/* DELETE DIALOG */}

            <Dialog
                open={deleteOpen}
                onOpenChange={
                    setDeleteOpen
                }
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle className="text-red-600">
                            Delete Category
                        </DialogTitle>

                        <DialogDescription>

                            {deleteTarget
                                ? "Are you sure you want to permanently delete this category?"
                                : `Delete ${selectedRows.length} selected categories?`}

                        </DialogDescription>

                    </DialogHeader>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteOpen(
                                    false
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => {

                                if (
                                    deleteTarget
                                ) {

                                    const category =
                                        categoriesData.find(
                                            (item) =>
                                                item.id ===
                                                deleteTarget
                                        );

                                    if (
                                        category
                                    ) {
                                        deleteCategory(
                                            category
                                        );
                                    }

                                    setDeleteTarget(
                                        null
                                    );

                                } else {

                                    deleteSelected();

                                }

                                setDeleteOpen(
                                    false
                                );

                            }}
                        >
                            Delete
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

            {/* SUB-CATEGORY DIALOG */}

            <Dialog
                open={subCategoryOpen}
                onOpenChange={
                    setSubCategoryOpen
                }
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Sub-category
                        </DialogTitle>

                        <DialogDescription>
                            Add a sub-category under{" "}
                            <strong>
                                {subCategoryCategory?.name}
                            </strong>.
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <Input
                            placeholder="Sub-category name"
                            value={subCategoryName}
                            onChange={(event) =>
                                setSubCategoryName(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setSubCategoryOpen(
                                    false
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={
                                !subCategoryName.trim()
                            }
                            onClick={
                                saveSubCategory
                            }
                        >
                            Add Sub-category
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

            {/* TAG DIALOG */}

            <Dialog
                open={tagOpen}
                onOpenChange={
                    setTagOpen
                }
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Tag
                        </DialogTitle>

                        <DialogDescription>
                            Add a tag under{" "}
                            <strong>
                                {tagSubCategory?.name}
                            </strong>.
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <Input
                            placeholder="Tag name"
                            value={tagName}
                            onChange={(event) =>
                                setTagName(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setTagOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={
                                !tagName.trim()
                            }
                            onClick={
                                saveTag
                            }
                        >
                            Add Tag
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>
        </>
    );
}

Categories.layout = {
    breadcrumbs: [
        {
            title: "Categories",
            href: "/categories",
        },
    ],
};