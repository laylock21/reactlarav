import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowUpDown,
    Trash2,
    CheckSquare,
    Plus,
} from "lucide-react";
import { Upload } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Products() {
    return (
        <>
            <Head title="Products" />

            <div className="space-y-6 p-6">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Products
                        </h1>

                        <p className="text-muted-foreground">
                            Manage all inventory products.
                        </p>
                    </div>
                </div>
                <Card>

                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">

                            {/* Left Side */}
                            <Input
                                placeholder="Search products..."
                                className="max-w-sm"
                            />

                            {/* Right Side */}
                            <div className="flex items-center gap-2">

                                {/* Sort */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => alert("Ascending")}>
                                            Ascending
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => alert("Descending")}>
                                            Descending
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Import */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => alert("CSV")}>
                                            CSV
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => alert("PDF")}>
                                            PDF
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Delete */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => alert("Delete")}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                                {/* Select All */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => alert("Select All")}
                                >
                                    <CheckSquare className="h-4 w-4" />
                                </Button>

                                {/* Add Product */}
                                <Button
                                    size="icon"
                                    onClick={() => alert("Add Product")}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>

                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>

                        <Table>

                            <TableHeader />

                            <TableBody />

                        </Table>

                    </CardContent>

                </Card>
            </div>
        </>
    );
}


Products.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: "/products",
        },
    ],
};