import { Card, CardContent } from "@/components/ui/card";

import {
    Package,
    ArrowDownToLine,
    ArrowUpFromLine,
    Pencil,
    Copy,
    Archive,
} from "lucide-react";

import type { Movement } from "./types";

type Props = {
    movements: Movement[];
};

export default function StockMovementStats({
    movements,
}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-6">

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Records
                        </p>

                        <h2 className="text-3xl font-bold">
                            {movements.length}
                        </h2>

                    </div>

                    <Package className="h-8 w-8 text-muted-foreground" />

                </CardContent>

            </Card>

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Stock In
                        </p>

                        <h2 className="text-3xl font-bold text-green-600">
                            {
                                movements.filter(
                                    m => m.type === "STOCK_IN"
                                ).length
                            }
                        </h2>

                    </div>

                    <ArrowDownToLine className="h-8 w-8 text-green-600" />

                </CardContent>

            </Card>

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Stock Out
                        </p>

                        <h2 className="text-3xl font-bold text-red-600">
                            {
                                movements.filter(
                                    m => m.type === "STOCK_OUT"
                                ).length
                            }
                        </h2>

                    </div>

                    <ArrowUpFromLine className="h-8 w-8 text-red-600" />

                </CardContent>

            </Card>

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Edited
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-500">
                            {
                                movements.filter(
                                    m => m.type === "EDITED"
                                ).length
                            }
                        </h2>

                    </div>

                    <Pencil className="h-8 w-8 text-yellow-500" />

                </CardContent>

            </Card>

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Duplicated
                        </p>

                        <h2 className="text-3xl font-bold text-violet-600">
                            {
                                movements.filter(
                                    m => m.type === "DUPLICATED"
                                ).length
                            }
                        </h2>

                    </div>

                    <Copy className="h-8 w-8 text-violet-600" />

                </CardContent>

            </Card>

            <Card>

                <CardContent className="flex items-center justify-between pt-6">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Archived
                        </p>

                        <h2 className="text-3xl font-bold text-gray-600">
                            {
                                movements.filter(
                                    m => m.type === "ARCHIVED"
                                ).length
                            }
                        </h2>

                    </div>

                    <Archive className="h-8 w-8 text-gray-600" />

                </CardContent>

            </Card>

        </div>
    );
}