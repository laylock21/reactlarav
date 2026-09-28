import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";

import type { Supplier } from "./suppliers-types";

type Props = {
    suppliers: Supplier[];

    selectedRows: number[];

    setSelectedRows: React.Dispatch<
        React.SetStateAction<number[]>
    >;

    setBulkDelete: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    setDeleteTarget: React.Dispatch<
        React.SetStateAction<Supplier | null>
    >;

    setDeleteOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    onEdit: (supplier: Supplier) => void;
};

export function SuppliersTable({
    suppliers,
    selectedRows,
    setSelectedRows,
    setBulkDelete,
    setDeleteTarget,
    setDeleteOpen,
    onEdit,
}: Props) {
    const allSelected =
        suppliers.length > 0 &&
        selectedRows.length === suppliers.length;

    const handleSelectAll = (
        checked: boolean | "indeterminate"
    ) => {
        if (checked) {
            setSelectedRows(
                suppliers.map((supplier) => supplier.id)
            );
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectSupplier = (
        checked: boolean | "indeterminate",
        supplierId: number
    ) => {
        if (checked) {
            setSelectedRows((prev) => [
                ...prev,
                supplierId,
            ]);

            return;
        }

        setSelectedRows((prev) =>
            prev.filter((id) => id !== supplierId)
        );
    };

    return (
        <div className="overflow-x-auto h-full">
            <div className="flex-1 min-w-full overflow-y-auto">
                <Table>

                    {/* TABLE HEADER */}

                    <TableHeader className="sticky top-0 bg-background z-10">

                        <TableRow className="border-b last:border-0">

                            {/* SELECT ALL */}

                            <TableHead className="w-12">

                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={
                                        handleSelectAll
                                    }
                                />

                            </TableHead>

                            {/* ACTION */}

                            <TableHead className="w-12" />

                            <TableHead>
                                Supplier
                            </TableHead>

                            <TableHead>
                                Contact Person
                            </TableHead>

                            <TableHead>
                                Phone
                            </TableHead>

                            <TableHead>
                                Email
                            </TableHead>

                            <TableHead>
                                Address
                            </TableHead>

                            <TableHead className="text-right">
                                Products
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    {/* TABLE BODY */}

                    <TableBody>

                        {suppliers.map((supplier) => (

                            <TableRow
                                key={supplier.id}
                                className="border-b border-slate-200 dark:border-slate-800"
                            >

                                {/* CHECKBOX */}

                                <TableCell>

                                    <Checkbox
                                        checked={selectedRows.includes(
                                            supplier.id
                                        )}
                                        onCheckedChange={(
                                            checked
                                        ) =>
                                            handleSelectSupplier(
                                                checked,
                                                supplier.id
                                            )
                                        }
                                    />

                                </TableCell>

                                {/* ACTION MENU */}

                                <TableCell>

                                    <DropdownMenu>

                                        <DropdownMenuTrigger
                                            asChild
                                        >

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                            >

                                                <MoreVertical className="h-4 w-4" />

                                            </Button>

                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="start"
                                            sideOffset={8}
                                            className="w-56"
                                        >

                                            {/* EDIT */}

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onEdit(supplier)
                                                }
                                            >

                                                <Pencil className="mr-2 h-4 w-4" />

                                                Edit Supplier

                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            {/* DELETE */}

                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => {

                                                    setBulkDelete(
                                                        false
                                                    );

                                                    setDeleteTarget(
                                                        supplier
                                                    );

                                                    setDeleteOpen(
                                                        true
                                                    );

                                                }}
                                            >

                                                <Trash2 className="mr-2 h-4 w-4" />

                                                Delete

                                            </DropdownMenuItem>

                                        </DropdownMenuContent>

                                    </DropdownMenu>

                                </TableCell>

                                {/* SUPPLIER */}

                                <TableCell className="font-medium">
                                    {supplier.name}
                                </TableCell>

                                {/* CONTACT PERSON */}

                                <TableCell>
                                    {supplier.contact_person ?? "—"}
                                </TableCell>

                                {/* PHONE */}

                                <TableCell>
                                    {supplier.phone ?? "—"}
                                </TableCell>

                                {/* EMAIL */}

                                <TableCell>
                                    {supplier.email ?? "—"}
                                </TableCell>

                                {/* ADDRESS */}

                                <TableCell className="max-w-xs truncate text-muted-foreground">
                                    {supplier.address ?? "—"}
                                </TableCell>

                                {/* PRODUCTS */}

                                <TableCell className="text-right">
                                    {supplier.products_count ?? 0}
                                </TableCell>

                            </TableRow>

                        ))}

                        {suppliers.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    No suppliers found.
                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>
            </div>
        </div>
    );
}
