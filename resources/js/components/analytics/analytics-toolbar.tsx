import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANALYTICS_VIEWS, type AnalyticsView, type DatePreset } from "./analytics-types";

type Props = {
    view: AnalyticsView;
    startDate: string;
    endDate: string;
};

const PRESETS: { value: Exclude<DatePreset, "custom">; label: string; days: number }[] = [
    { value: "today", label: "Today", days: 0 },
    { value: "7d", label: "Last 7 days", days: 6 },
    { value: "30d", label: "Last 30 days", days: 29 },
    { value: "90d", label: "Last 90 days", days: 89 },
];

function toISO(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function apply(view: AnalyticsView, start: string, end: string) {
    router.get(
        "/analytics",
        { view, start_date: start, end_date: end },
        { preserveState: true, preserveScroll: true, replace: true }
    );
}

export function AnalyticsToolbar({ view, startDate, endDate }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <Select value={view} onValueChange={(value) => apply(value as AnalyticsView, startDate, endDate)}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                        {ANALYTICS_VIEWS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {PRESETS.map((preset) => (
                    <Button
                        key={preset.value}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const end = new Date();
                            const start = new Date();
                            start.setDate(end.getDate() - preset.days);
                            apply(view, toISO(start), toISO(end));
                        }}
                    >
                        {preset.label}
                    </Button>
                ))}

                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        className="w-auto"
                        value={startDate}
                        max={endDate}
                        onChange={(event) => {
                            if (event.target.value) {
                                apply(view, event.target.value, endDate);
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
                                apply(view, startDate, event.target.value);
                            }
                        }}
                        aria-label="End date"
                    />
                </div>
            </div>

            <Button
                variant="outline"
                onClick={() => {
                    toast.success("Preparing CSV export...");
                    window.location.href = `/analytics/export?view=${view}&start_date=${startDate}&end_date=${endDate}`;
                }}
            >
                Export CSV
            </Button>

            <Button
                onClick={() => router.get(`/analytics/graphs?start_date=${startDate}&end_date=${endDate}`)}
            >
                View Graphs
            </Button>

            <Button
                onClick={() => {
                    router.post(
                        "/analytics/snapshots",
                        {},
                        {
                            preserveScroll: true,
                            onSuccess: () => toast.success("Snapshots generated successfully."),
                            onError: () => toast.error("Unable to generate snapshots."),
                        }
                    );
                }}
            >
                Run Snapshot Now
            </Button>
        </div>
    );
}
