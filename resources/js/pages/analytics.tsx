import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnalyticsTable } from "@/components/analytics/analytics-table";
import { AnalyticsToolbar } from "@/components/analytics/analytics-toolbar";
import { isPaginated, type AnalyticsRecords, type AnalyticsView } from "@/components/analytics/analytics-types";

type Props = {
    view: AnalyticsView;
    startDate: string;
    endDate: string;
    records: AnalyticsRecords;
};

export default function Analytics({ view, startDate, endDate, records }: Props) {
    const rows = isPaginated(records) ? records.data : records;
    const list = isPaginated(records) ? records : null;

    return (
        <>
            <Head title="Analytics" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground">
                            {startDate} to {endDate}
                        </p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <AnalyticsToolbar view={view} startDate={startDate} endDate={endDate} />
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <AnalyticsTable view={view} rows={rows} />
                    </CardContent>
                </Card>
                {list && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Page {list.current_page} of {list.last_page}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={!list.prev_page_url}
                                onClick={() => list.prev_page_url && router.get(list.prev_page_url)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!list.next_page_url}
                                onClick={() => list.next_page_url && router.get(list.next_page_url)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Analytics.layout = {
    breadcrumbs: [{ title: "Analytics", href: "/analytics" }],
};
