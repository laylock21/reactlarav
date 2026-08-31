export type Tag = {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
};

export type SubCategory = {
    id: number;
    category_id: number;
    name: string;
    created_at: string;
    updated_at: string;

    tags?: Tag[];
};

export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;

    sub_categories?: SubCategory[];
};

export type CategoryForm = {
    name: string;
    description: string;
};

export type SubCategoryForm = {
    category_id: number | null;
    name: string;
    description: string;
};


export type TagForm = {
    sub_category_id: number | null;
    name: string;
};

export const emptyCategoryForm: CategoryForm = {
    name: "",
    description: "",
};

export const emptySubCategoryForm: SubCategoryForm = {
    category_id: null,
    name: "",
    description: "",
};

export const emptyTagForm: TagForm = {
    sub_category_id: null,
    name: "",
};  