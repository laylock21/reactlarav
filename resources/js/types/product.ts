export interface Product {
    id: number;

    sku: string;
    barcode: string | null;

    name: string;
    supplier: string;
    category: string;
    unit: string;

    quantity: number;
    minimum_stock: number;

    cost_price: number;
    selling_price: number;

    status: string;
    description: string | null;

    archived: boolean;

    created_at: string;
    updated_at: string;
}