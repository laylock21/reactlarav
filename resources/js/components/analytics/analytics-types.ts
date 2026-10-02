export type AnalyticsView =
    | "stock_movements"
    | "stock_count"
    | "total_sold"
    | "revenue"
    | "returns"
    | "snapshots";

export const ANALYTICS_VIEWS: { value: AnalyticsView; label: string }[] = [
    { value: "stock_movements", label: "Stock Movements" },
    { value: "stock_count", label: "Stock Count" },
    { value: "total_sold", label: "Total Sold" },
    { value: "revenue", label: "Revenue" },
    { value: "returns", label: "Returns" },
    { value: "snapshots", label: "Snapshots" },
];

export type AnalyticsList = {
    data: Record<string, any>[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type AnalyticsRecords = AnalyticsList | Record<string, any>[];

export function isPaginated(records: AnalyticsRecords): records is AnalyticsList {
    return !Array.isArray(records) && Array.isArray((records as AnalyticsList).data);
}

export type DatePreset = "today" | "7d" | "30d" | "90d" | "custom";
