import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ChartDatum = Record<string, string | number>;

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 px-6 py-4">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 px-4 pb-4">
                <div className="h-72 w-full">{children}</div>
            </CardContent>
        </Card>
    );
}

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"];

export function StockOverTimeChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Stock Level Over Time">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stock" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function TopProductsChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Top Selling Products">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function RevenueTrendChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Revenue Trend">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function StockInOutChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Stock In vs Adjusted">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function CategoryShareChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Sales by Category">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                        {data.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function ReturnsTrendChart({ data }: { data: ChartDatum[] }) {
    return (
        <ChartCard title="Returns Trend">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quantity" stroke="#ff8042" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
