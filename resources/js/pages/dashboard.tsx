import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Inventory Dashboard
                    </h1>

                    <p className="text-muted-foreground">
                        Welcome back! Here's an overview of your inventory.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Products</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-4xl font-bold">
                                128
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-4xl font-bold">
                                12
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Suppliers</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-4xl font-bold">
                                18
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-4xl font-bold">
                                5
                            </p>
                        </CardContent>
                    </Card>

                </div>

                <div className="rounded-xl border p-6">

                    <h2 className="mb-4 text-xl font-semibold">
                        Recent Activity
                    </h2>

                    <div className="space-y-3">

                        <div className="rounded-lg bg-muted p-3">
                            📦 Added Product
                        </div>

                        <div className="rounded-lg bg-muted p-3">
                            📥 Stock In
                        </div>

                        <div className="rounded-lg bg-muted p-3">
                            📤 Stock Out
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}   

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
