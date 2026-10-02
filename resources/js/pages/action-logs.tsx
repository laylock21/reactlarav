import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ActionLog = {
    id: number;
    action: string;
    model_type: string;
    model_id: number;
    description: string;
    created_at: string;
    user?: { id: number; name: string } | null;
};

const MODEL_TYPES = [
    "users", "categories", "suppliers", "customers", "tags", "products",
    "product_tags", "stock_thresholds", "stocks", "stock_movements",
    "orders", "order_items", "user_settings",
];

const ACTIONS = ["created", "updated", "deleted"];

type Props = {
    logs: {
        data: ActionLog[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: { search?: string; model_type?: string | null; action?: string | null; start_date?: string | null; end_date?: string | null };
};

export default function ActionLogs({ logs: logList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");

    const applyFilter = (key: string, value: string) => {
        router.get(
            "/action-logs",
            {
                search: search || undefined,
                model_type: filters?.model_type ?? undefined,
                action: filters?.action ?? undefined,
                start_date: filters?.start_date ?? undefined,
                end_date: filters?.end_date ?? undefined,
                [key]: value === "all" ? undefined : value || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Action Logs" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Action Logs</h1>
                        <p className="text-muted-foreground">Audit trail of record changes.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get(
                                            "/action-logs",
                                            {
                                                search: value || undefined,
                                                model_type: filters?.model_type ?? undefined,
                                                action: filters?.action ?? undefined,
                                                start_date: filters?.start_date ?? undefined,
                                                end_date: filters?.end_date ?? undefined,
                                            },
                                            { preserveState: true, preserveScroll: true, replace: true }
                                        );
                                    }}
                                />
                            </div>
                            <Select value={filters?.model_type ?? "all"} onValueChange={(value) => applyFilter("model_type", value)}>
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All models</SelectItem>
                                    {MODEL_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filters?.action ?? "all"} onValueChange={(value) => applyFilter("action", value)}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All actions</SelectItem>
                                    {ACTIONS.map((action) => (
                                        <SelectItem key={action} value={action} className="capitalize">{action}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="log-start" className="sr-only">Start date</Label>
                                <Input
                                    id="log-start"
                                    type="date"
                                    className="w-auto"
                                    value={filters?.start_date ?? ""}
                                    max={filters?.end_date ?? undefined}
                                    onChange={(event) => applyFilter("start_date", event.target.value)}
                                />
                                <span className="text-sm text-muted-foreground">to</span>
                                <Label htmlFor="log-end" className="sr-only">End date</Label>
                                <Input
                                    id="log-end"
                                    type="date"
                                    className="w-auto"
                                    value={filters?.end_date ?? ""}
                                    min={filters?.start_date ?? undefined}
                                    onChange={(event) => applyFilter("end_date", event.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead>Action</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Model</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logList.data.map((log) => (
                                            <TableRow key={log.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <Badge
                                                        variant={log.action === "deleted" ? "destructive" : log.action === "created" ? "default" : "secondary"}
                                                        className="capitalize"
                                                    >
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-md truncate font-medium">{log.description}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {log.model_type} #{log.model_id}
                                                </TableCell>
                                                <TableCell>{log.user?.name ?? "—"}</TableCell>
                                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {logList.data.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                    No logs found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Page {logList.current_page} of {logList.last_page}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!logList.prev_page_url}
                            onClick={() => logList.prev_page_url && router.get(logList.prev_page_url)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!logList.next_page_url}
                            onClick={() => logList.next_page_url && router.get(logList.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

ActionLogs.layout = {
    breadcrumbs: [{ title: "Action Logs", href: "/action-logs" }],
};
