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
import { ProductDialog } from "@/components/products/partials/product-dialog";
import type {
    ProductForm,
} from "@/components/products/products-types";
import products from "@/routes/products";

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

    const [editingSubCategory, setEditingSubCategory] =
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
    | Product Dialog
    |--------------------------------------------------------------------------
    */

    const emptyProductForm: ProductForm = {
        sku: "",
        barcode: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        quantity: 0,
        minimum_stock: 0,
        cost_price: 0,
        selling_price: 0,
        status: "Pending",
        description: "",
        archived: false,
    };

    const [productOpen, setProductOpen] =
        useState(false);

    const [productForm, setProductForm] =
        useState<ProductForm>(
            emptyProductForm
        );
    /*
    |--------------------------------------------------------------------------
    | Tag Dialog
    |--------------------------------------------------------------------------
    */

    const [tagOpen, setTagOpen] =
        useState(false);
        
    /*
    |--------------------------------------------------------------------------
    | Sub-category
    |--------------------------------------------------------------------------
    */

    const [subCategoryForm, setSubCategoryForm] =
        useState<SubCategoryForm>(
            emptySubCategoryForm
        );

    const editSubCategory = (
        subCategory: SubCategory
    ) => {
        setEditingSubCategory(
            subCategory.id
        );

        setSubCategoryForm({
            category_id:
                subCategory.category_id,

            name:
                subCategory.name,

            description:
                "",
        });

        setSubCategoryOpen(true);
    };

    const editTag = (
        tag: Tag
    ) => {
        setEditingTag(tag.id);

        setTagSubCategory(null);

        setTagForm({
            sub_category_id: tag.sub_category_id,
            name: tag.name,
        });

        setTagOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Tag
    |--------------------------------------------------------------------------
    */

    const [tagForm, setTagForm] =
    useState<TagForm>(
        emptyTagForm
    );

    const [tagNames, setTagNames] =
        useState<string[]>([]);

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
    | Save Product
    |--------------------------------------------------------------------------
    */

    const saveProduct = () => {
        router.post(
            products.store().url,
            productForm,
            {
                preserveScroll: true,
                preserveState: false,

                onSuccess: () => {
                    setProductOpen(false);

                    setProductForm(
                        emptyProductForm
                    );

                    toast.success(
                        "Product added successfully.",
                        {
                            description:
                                "The product and its initial stock have been created successfully.",
                        }
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to add product.",
                        {
                            description:
                                "There was an error while creating the product.",
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
        if (!subCategoryForm.category_id) {
            toast.error("Category is required.");

            return;
        }

        if (!subCategoryForm.name.trim()) {
            toast.error("Sub-category name is required.");

            return;
        }

        if (editingSubCategory) {
            router.put(
                `/sub-categories/${editingSubCategory}`,
                {
                    name: subCategoryForm.name.trim(),
                    description: subCategoryForm.description,
                },
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setEditingSubCategory(null);

                        setSubCategoryForm(
                            emptySubCategoryForm
                        );

                        setSubCategoryOpen(false);

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
                name: subCategoryForm.name.trim(),
                description: subCategoryForm.description,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setSubCategoryForm(
                        emptySubCategoryForm
                    );

                    setSubCategoryOpen(false);

                    toast.success(
                        "Sub-category added successfully.",
                        {
                            description:
                                "The sub-category has been added to the selected category.",
                        }
                    );
                },

                onError: () => {
                    toast.error(
                        "Unable to add sub-category.",
                        {
                            description:
                                "There was an error while adding the sub-category.",
                        }
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

        if (!tagForm.sub_category_id) {
            toast.error(
                "Sub-category is required."
            );

            return;
        }

        const tags = tagNames
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (tags.length === 0) {
            toast.error(
                "Add at least one tag."
            );

            return;
        }

        const requests = tags.map((name) =>
            router.post(
                `/sub-categories/${tagForm.sub_category_id}/tags`,
                {
                    name,
                },
                {
                    preserveScroll: true,
                }
            )
        );

        setTagForm(emptyTagForm);
        setTagNames([]);
        setTagOpen(false);

        toast.success(
            `${tags.length} ${
                tags.length === 1
                    ? "tag"
                    : "tags"
            } added successfully.`
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

    const editCategory = (
        category: Category
    ) => {

        setEditingCategory(category.id);

        setForm({
            name: category.name,
            description: category.description || "",
        });

        setOpen(true);
    };

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
                            setDeleteOpen={
                                setDeleteOpen
                            }
                            setDeleteTarget={
                                setDeleteTarget
                            }
                            onAddProduct={() => {
                                setProductForm(
                                    emptyProductForm
                                );

                                setProductOpen(true);
                            }}
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

                            onAddSubCategory={(category) => {
                            setSubCategoryForm({
                                category_id: category.id,
                                name: "",
                                description: "",
                            });

                            setEditingSubCategory(null);

                            setSubCategoryOpen(true);
                        }}

                        onAddTag={(subCategory) => {
                            setTagSubCategory(subCategory);

                            setTagForm({
                                sub_category_id: subCategory.id,
                                name: "",
                            });

                            setEditingTag(null);

                            setTagOpen(true);
                        }}

                        onEditSubCategory={
                            editSubCategory
                        }

                        onDeleteSubCategory={
                            deleteSubCategory
                        }

                        onEditTag={
                            editTag
                        }

                        onDeleteTag={
                            deleteTag
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

            {/* PRODUCT DIALOG */}

            <ProductDialog
                open={productOpen}
                onOpenChange={(value) => {
                    setProductOpen(value);

                    if (!value) {
                        setProductForm(
                            emptyProductForm
                        );
                    }
                }}
                form={productForm}
                setForm={setProductForm}
                onSave={saveProduct}
                categories={categoriesData}
                editing={false}
            />

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
                onOpenChange={setSubCategoryOpen}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            {editingSubCategory
                                ? "Edit Sub-category"
                                : "Add Sub-category"}
                        </DialogTitle>

                        <DialogDescription>
                            {editingSubCategory
                                ? "Update the sub-category information."
                                : "Add a sub-category under the selected category."}
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        <Input
                            id="sub-category-name"
                            name="sub_category_name"
                            placeholder="Sub-category name"
                            value={subCategoryForm.name}
                            onChange={(event) =>
                                setSubCategoryForm({
                                    ...subCategoryForm,
                                    name: event.target.value,
                                })
                            }
                        />

                        <Textarea
                            id="sub-category-description"
                            name="sub_category_description"
                            placeholder="Description"
                            value={subCategoryForm.description}
                            onChange={(event) =>
                                setSubCategoryForm({
                                    ...subCategoryForm,
                                    description: event.target.value,
                                })
                            }
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setSubCategoryOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={
                                !subCategoryForm.name.trim() ||
                                !subCategoryForm.category_id
                            }
                            onClick={saveSubCategory}
                        >
                            {editingSubCategory
                                ? "Save Changes"
                                : "Add Sub-category"}
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
                            Add Tags
                        </DialogTitle>

                        <DialogDescription>
                            Add multiple tags under the selected sub-category.
                        </DialogDescription>

                    </DialogHeader>

                    <div className="space-y-4">

                        {/* Existing tags being added */}

                        {tagNames.length > 0 && (
                            <div className="flex flex-wrap gap-2">

                                {tagNames.map(
                                    (tag, index) => (
                                        <div
                                            key={`${tag}-${index}`}
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-md
                                                border
                                                bg-muted
                                                px-3
                                                py-1
                                                text-sm
                                            "
                                        >

                                            <span>
                                                {tag}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTagNames(
                                                        (prev) =>
                                                            prev.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            )
                                                    )
                                                }
                                                className="
                                                    text-muted-foreground
                                                    hover:text-foreground
                                                "
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                        {/* Tag input */}

                        <Input
                            id="tag-name"
                            name="tag_name"
                            placeholder="Enter tag name and press Enter..."
                            value={tagForm.name}
                            onChange={(event) =>
                                setTagForm({
                                    ...tagForm,
                                    name: event.target.value,
                                })
                            }
                            onKeyDown={(event) => {

                                if (
                                    event.key === "Enter"
                                ) {

                                    event.preventDefault();

                                    const name =
                                        tagForm.name.trim();

                                    if (!name) {
                                        return;
                                    }

                                    if (
                                        tagNames.some(
                                            (tag) =>
                                                tag.toLowerCase() ===
                                                name.toLowerCase()
                                        )
                                    ) {
                                        toast.error(
                                            "That tag has already been added."
                                        );

                                        return;
                                    }

                                    setTagNames(
                                        (prev) => [
                                            ...prev,
                                            name,
                                        ]
                                    );

                                    setTagForm({
                                        ...tagForm,
                                        name: "",
                                    });
                                }

                            }}
                        />

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setTagOpen(false);
                                setTagNames([]);
                                setTagForm(emptyTagForm);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={
                                tagNames.length === 0 ||
                                !tagForm.name.trim()
                            }
                            onClick={saveTag}
                        >
                            Add Tags
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