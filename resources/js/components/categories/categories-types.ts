export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type CategoryForm = {
    name: string;
    description: string;
};

export const emptyCategoryForm: CategoryForm = {
    name: "",
    description: "",
};