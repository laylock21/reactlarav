export type ProductSnapshot = {
    sku?: string;
    barcode?: string;
    name?: string;
    supplier?: string;
    category?: string;
    unit?: string;
    quantity?: number;
    minimum_stock?: number;
    cost_price?: number;
    selling_price?: number;
    status?: string;
    description?: string;
};

export type Movement = {
    id: number;
    type: string;
    quantity: number;
    before_quantity: number;
    after_quantity: number;
    remarks: string | null;
    created_at: string;

    before_data?: ProductSnapshot | null;
    after_data?: ProductSnapshot | null;

    product: {
        id: number;
        name: string;
        sku: string;
    };

    user: {
        name: string;
    } | null;
};