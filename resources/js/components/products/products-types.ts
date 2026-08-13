import type { Product } from "@/types/product";

export type ProductList = {
    data: Product[];

    current_page: number;
    last_page: number;

    prev_page_url: string | null;
    next_page_url: string | null;
};

export type ProductForm = Omit<
    Product,
    "id" | "created_at" | "updated_at"
>;

export type ProductStatus =
    | "all"
    | "Delivered"
    | "Pending"
    | "Low Stock";

export type ProductsProps = {
    products: ProductList;
};