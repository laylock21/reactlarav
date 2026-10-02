import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CategoryShareChart,
    ReturnsTrendChart,
    RevenueTrendChart,
    StockInOutChart,
    StockOverTimeChart,
    TopProductsChart,
    type ChartDatum,
} from "@/components/analytics/analytics-charts";

type Props = {
    startDate: string;
    endDate: string;
    charts: {
        stock_over_time: ChartDatum[];
        top_products: ChartDatum[];
        revenue_trend: ChartDatum[];
        stock_in_out: ChartDatum[];
        category_share: ChartDatum[];
        returns_trend: ChartDatum[];
    };
};

export default function AnalyticsGraphs({ startDate, endDate, charts }: Props) {
    const applyRange = (start: string, end: string) => {
        router.get(
            "/analytics/graphs",
            { start_date: start, end_date: end },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Analytics Graphs" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Graphs</h1>
                        <p className="text-muted-foreground">
                            {startDate} to {endDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            className="w-auto"
                            value={startDate}
                            max={endDate}
                            onChange={(event) => {
                                if (event.target.value) {
                                    applyRange(event.target.value, endDate);
                                }
                            }}
                            aria-label="Start date"
                        />
                        <span className="text-sm text-muted-foreground">to</span>
                        <Input
                            type="date"
                            className="w-auto"
                            value={endDate}
                            min={startDate}
                            onChange={(event) => {
                                if (event.target.value) {
                                    applyRange(startDate, event.target.value);
                                }
                            }}
                            aria-label="End date"
                        />
                        <Button variant="outline" onClick={() => router.get("/analytics")}>
                            Back to Tables
                        </Button>
                    </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
                    <StockOverTimeChart data={charts.stock_over_time} />
                    <RevenueTrendChart data={charts.revenue_trend} />
                    <TopProductsChart data={charts.top_products} />
                    <StockInOutChart data={charts.stock_in_out} />
                    <CategoryShareChart data={charts.category_share} />
                    <ReturnsTrendChart data={charts.returns_trend} />
                </div>
            </div>
        </>
    );
}

AnalyticsGraphs.layout = {
    breadcrumbs: [
        { title: "Analytics", href: "/analytics" },
        { title: "Graphs", href: "/analytics/graphs" },
    ],
};
