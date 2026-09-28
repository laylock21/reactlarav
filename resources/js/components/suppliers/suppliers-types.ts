export type Supplier = {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;

    products_count?: number;
};

export type SupplierList = {
    data: Supplier[];

    current_page: number;
    last_page: number;

    prev_page_url: string | null;
    next_page_url: string | null;
};

export type SupplierForm = {
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
};

export const emptySupplierForm: SupplierForm = {
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
};
