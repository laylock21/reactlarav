export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;

    parent_id: number | null;
    parent?: Pick<Category, "id" | "name"> | null;

    children?: Category[];
    children_count?: number;
    products_count?: number;
};

export type CategoryForm = {
    name: string;
    parent_id: number | null;
    description: string;
};

export const emptyCategoryForm: CategoryForm = {
    name: "",
    parent_id: null,
    description: "",
};
