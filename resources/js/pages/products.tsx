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
    Search,
    Filter,
    Upload,
    Trash2,
    CheckSquare,
    Plus,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const products = [
    {
        id: 1,
        sku: "P001",
        name: "Logitech G102",
        supplier: "Logitech",
        category: "Mouse",
        stock: 45,
        price: 895,
        status: "Delivered",
        ordered: "2026-07-18"
    },
    {
        id: 2,
        sku: "P002",
        name: "Royal Kludge RK61",
        supplier: "Royal Kludge",
        category: "Keyboard",
        stock: 18,
        price: 2395,
        status: "Pending",
        ordered: "2026-07-20",
    },
    {
        id: 3,
        sku: "P003",
        name: "AOC 24G2",
        supplier: "AOC",
        category: "Monitor",
        stock: 7,
        price: 8995,
        status: "Delivered",
        ordered: "2026-07-22",
    },
];
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

                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">

                            {/* Left Side */}
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    placeholder="Search products..."
                                    className="pl-9"
                                />
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-2">

                                {/* Sort */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            All Products
                                        </DropdownMenuItem>
        
                                        <DropdownMenuItem>
                                            Delivered
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            Pending
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            Low Stock
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

                    <CardContent className="px-8 pb-6 overflow-x-auto">

                        <Table>

                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow className="border-b last:border-0">

                                    <TableHead className="w-12">
                                        <Checkbox />
                                    </TableHead>

                                    <TableHead className="w-12"></TableHead>

                                    <TableHead>SKU</TableHead>

                                    <TableHead>Supplier</TableHead>
        
                                    <TableHead>Product</TableHead>

                                    <TableHead>Category</TableHead>

                                    <TableHead>Stock</TableHead>

                                    <TableHead>Status</TableHead>

                                    <TableHead>Ordered</TableHead>

                                    <TableHead className="text-right">
                                        Price
                                    </TableHead>


                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {products.map((product) => (

                                    <TableRow
                                        key={product.id}
                                        className="border-b border-slate-200 dark:border-slate-800"
                                    >
                                        
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>

                                        <TableCell>{product.sku}</TableCell>

                                        <TableCell>{product.supplier}</TableCell>

                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>

                                        <TableCell>{product.category}</TableCell>

                                        <TableCell>{product.stock}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={
                                                    product.status === "Delivered"
                                                        ? "bg-green-600"
                                                        : product.status === "Pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-blue-500"
                                                }
                                            >
                                                {product.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{product.ordered}</TableCell>

                                        <TableCell className="text-right">
                                            ₱{product.price.toLocaleString()}
                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

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