import type { Product } from "@/types/product";

export type ArchivedProduct = Product & {
    archived: boolean | number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type ArchivedProductsResponse = {
    data: ArchivedProduct[];

    current_page: number;
    last_page: number;

    prev_page_url: string | null;
    next_page_url: string | null;

    links: PaginationLink[];
};