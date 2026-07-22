export type Product = {
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
    created_at: string;
};