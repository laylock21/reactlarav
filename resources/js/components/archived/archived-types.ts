import type { Product } from "@/types/product";

export type ArchivedProduct = Product;

export type ArchivedPagination = {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type ArchivedProducts = {
    data: ArchivedProduct[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type ArchivedProductsResponse = {
    data: ArchivedProduct[];

    current_page: number;
    last_page: number;

    prev_page_url: string | null;
    next_page_url: string | null;
};