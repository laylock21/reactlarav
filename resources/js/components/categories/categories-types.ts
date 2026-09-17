export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;

    parent_id: number | null;
    parent?: Pick<Category, "id" | "name"> | null;
    // Kept temporarily for the existing product form; category management no
    // longer creates or edits this legacy relation.
    sub_categories?: {
        id: number;
        name: string;
        tags?: { id: number; name: string }[];
    }[];
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
