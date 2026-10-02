import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { AnalyticsView } from "./analytics-types";

type Props = {
    view: AnalyticsView;
    rows: Record<string, any>[];
};

function formatDate(value: any): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function formatMoney(value: any): string {
    return `₱${Number(value ?? 0).toLocaleString()}`;
}

function Cell({ children, right, muted, medium }: { children: React.ReactNode; right?: boolean; muted?: boolean; medium?: boolean }) {
    return (
        <TableCell className={[right ? "text-right" : "", muted ? "text-muted-foreground" : "", medium ? "font-medium" : ""].join(" ")}>
            {children}
        </TableCell>
    );
}

export function AnalyticsTable({ view, rows }: Props) {
    return (
        <div className="overflow-x-auto h-full">
            <div className="flex-1 min-w-full overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        {view === "stock_movements" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Before</TableHead>
                                <TableHead className="text-right">After</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        )}
                        {view === "stock_count" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Min</TableHead>
                                <TableHead className="text-right">Max</TableHead>
                            </TableRow>
                        )}
                        {view === "total_sold" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        )}
                        {view === "revenue" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Orders</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Total Revenue</TableHead>
                            </TableRow>
                        )}
                        {view === "returns" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        )}
                        {view === "snapshots" && (
                            <TableRow className="border-b last:border-0">
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                                <TableHead className="text-right">Sold</TableHead>
                                <TableHead className="text-right">Added</TableHead>
                                <TableHead className="text-right">Removed</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        )}
                    </TableHeader>
                    <TableBody>
                        {view === "stock_movements" &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.product?.name ?? "—"}</Cell>
                                    <Cell>
                                        <Badge variant="secondary" className="capitalize">{row.type}</Badge>
                                    </Cell>
                                    <Cell right>{row.quantity}</Cell>
                                    <Cell right>{row.before_quantity}</Cell>
                                    <Cell right>{row.after_quantity}</Cell>
                                    <Cell muted>{row.remarks ?? "—"}</Cell>
                                    <Cell muted>{formatDate(row.created_at)}</Cell>
                                </TableRow>
                            ))}
                        {view === "stock_count" &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.name}</Cell>
                                    <Cell>{row.sku}</Cell>
                                    <Cell right>{row.quantity}</Cell>
                                    <Cell>
                                        <Badge variant="outline" className="capitalize">{row.status}</Badge>
                                    </Cell>
                                    <Cell right>{row.stock_threshold?.min_quantity ?? "—"}</Cell>
                                    <Cell right>{row.stock_threshold?.max_quantity ?? "—"}</Cell>
                                </TableRow>
                            ))}
                        {view === "total_sold" &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.product?.name ?? "—"}</Cell>
                                    <Cell right>{row.quantity}</Cell>
                                    <Cell right>{formatMoney(row.amount)}</Cell>
                                    <Cell muted>{formatDate(row.created_at)}</Cell>
                                </TableRow>
                            ))}
                        {view === "revenue" &&
                            rows.map((row: any, index: number) => (
                                <TableRow key={row.product_id ?? index} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.product?.name ?? "—"}</Cell>
                                    <Cell right>{row.orders_count}</Cell>
                                    <Cell right>{row.quantity}</Cell>
                                    <Cell right>{formatMoney(row.total_revenue)}</Cell>
                                </TableRow>
                            ))}
                        {view === "returns" &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.product?.name ?? "—"}</Cell>
                                    <Cell right>{row.quantity}</Cell>
                                    <Cell muted>{formatDate(row.created_at)}</Cell>
                                </TableRow>
                            ))}
                        {view === "snapshots" &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <Cell medium>{row.product?.name ?? "—"}</Cell>
                                    <Cell muted>{formatDate(row.snapshot_date)}</Cell>
                                    <Cell right>{row.stock_quantity}</Cell>
                                    <Cell right>{row.total_sold}</Cell>
                                    <Cell right>{row.total_added}</Cell>
                                    <Cell right>{row.total_removed}</Cell>
                                    <Cell right>{formatMoney(row.total_revenue)}</Cell>
                                </TableRow>
                            ))}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                    No records found for this view and date range.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
