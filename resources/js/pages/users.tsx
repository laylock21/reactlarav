import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type AppUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    phone_number: string | null;
    address: string | null;
    orders_count?: number;
};

type UserForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    is_active: boolean;
    phone_number: string;
    address: string;
};

const emptyUserForm: UserForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "staff",
    is_active: true,
    phone_number: "",
    address: "",
};

type Props = {
    users: {
        data: AppUser[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters?: { search?: string };
};

export default function Users({ users: userList, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [usersData, setUsersData] = useState(userList.data);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
    const [form, setForm] = useState<UserForm>(emptyUserForm);

    useEffect(() => setUsersData(userList.data), [userList.data]);

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();
        return value
            ? usersData.filter((user) => [user.name, user.email, user.role].join(" ").toLowerCase().includes(value))
            : usersData;
    }, [usersData, search]);

    const allSelected = filteredUsers.length > 0 && selectedRows.length === filteredUsers.length;
    const toggleAll = (checked: boolean | "indeterminate") =>
        setSelectedRows(checked ? filteredUsers.map((user) => user.id) : []);
    const toggleRow = (id: number, checked: boolean | "indeterminate") =>
        setSelectedRows((current) => (checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id)));

    const openCreate = () => { setEditingUser(null); setForm(emptyUserForm); setFormOpen(true); };
    const openEdit = (user: AppUser) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.role,
            is_active: user.is_active,
            phone_number: user.phone_number ?? "",
            address: user.address ?? "",
        });
        setFormOpen(true);
    };

    const saveUser = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditingUser(null);
                setForm(emptyUserForm);
                toast.success(editingUser ? "User updated successfully." : "User added successfully.");
            },
            onError: () => toast.error("Unable to save user. Check the name, email, and password."),
        };
        editingUser ? router.put(`/users/${editingUser.id}`, form, options) : router.post("/users", form, options);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/users/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setUsersData((prev) => prev.filter((user) => user.id !== deleteTarget.id));
                    setDeleteOpen(false);
                    setDeleteTarget(null);
                    toast.success("User deleted successfully.");
                },
                onError: (errors: Record<string, string>) => toast.error(errors.user ?? "This user cannot be deleted."),
            });
            return;
        }

        if (selectedRows.length) {
            const ids = [...selectedRows];
            ids.forEach((id) =>
                router.delete(`/users/${id}`, {
                    preserveScroll: true,
                    onError: (errors: Record<string, string>) => toast.error(errors.user ?? "A selected user could not be deleted."),
                })
            );
            setUsersData((prev) => prev.filter((user) => !ids.includes(user.id)));
            setSelectedRows([]);
            setDeleteOpen(false);
            toast.success(`${ids.length} users deleted successfully.`);
        }
    };

    return (
        <>
            <Head title="Users" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Users</h1>
                        <p className="text-muted-foreground">Manage system users and roles.</p>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSearch(value);
                                        router.get("/users", { search: value }, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => { setDeleteTarget(null); setDeleteOpen(true); }}
                                    className="transition-colors duration-300 ease-out"
                                >
                                    <Trash2 className={`mr-2 h-4 w-4 transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`} />
                                    <span className={`transition-all duration-200 ${selectedRows.length > 0 ? "text-red-600 scale-100" : "text-muted-foreground scale-95"}`}>
                                        Delete
                                    </span>
                                </Button>
                                <Button onClick={openCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead className="w-12">
                                                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all users" />
                                            </TableHead>
                                            <TableHead className="w-12" />
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Orders</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="border-b border-slate-200 dark:border-slate-800">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(user.id)}
                                                        onCheckedChange={(checked) => toggleRow(user.id, checked)}
                                                        aria-label={`Select ${user.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label={`Actions for ${user.name}`}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                                                            <DropdownMenuItem onClick={() => openEdit(user)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => { setDeleteTarget(user); setDeleteOpen(true); }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.is_active ? "default" : "outline"}>
                                                        {user.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{user.orders_count ?? 0}</TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    No users found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Go to page</span>
                        <select
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                            value={userList.current_page}
                            onChange={(e) => router.get(`/users?page=${e.target.value}`)}
                        >
                            {Array.from({ length: userList.last_page }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" disabled={userList.current_page === 1} onClick={() => userList.prev_page_url && router.get(userList.prev_page_url)}>
                            Previous
                        </Button>
                        {Array.from({ length: Math.max(userList.last_page, 5) }, (_, i) => (
                            <Button
                                key={i}
                                variant={userList.current_page === i + 1 ? "default" : "outline"}
                                disabled={i + 1 > userList.last_page}
                                onClick={() => router.get(`/users?page=${i + 1}`)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button variant="outline" disabled={userList.current_page === userList.last_page} onClick={() => userList.next_page_url && router.get(userList.next_page_url)}>
                            Next
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {userList.current_page} of {userList.last_page}
                    </div>
                </div>
            </div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                        <DialogDescription>Enter the user details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-name">Name</Label>
                                <Input id="user-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-email">Email</Label>
                                <Input id="user-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="user@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-password">{editingUser ? "New password (optional)" : "Password"}</Label>
                                <Input id="user-password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" autoComplete="new-password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-password-confirmation">Confirm password</Label>
                                <Input id="user-password-confirmation" type="password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} placeholder="••••••••" autoComplete="new-password" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-role">Role</Label>
                                <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                                    <SelectTrigger id="user-role"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-active">Status</Label>
                                <Select value={form.is_active ? "active" : "inactive"} onValueChange={(value) => setForm({ ...form, is_active: value === "active" })}>
                                    <SelectTrigger id="user-active"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-phone">Contact number</Label>
                                <Input id="user-phone" value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} placeholder="09171234567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-address">Address</Label>
                                <Textarea id="user-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Address" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={saveUser} disabled={!form.name.trim() || !form.email.trim()}>
                            {editingUser ? "Save Changes" : "Add User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete User</DialogTitle>
                        <DialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to permanently delete "${deleteTarget.name}"?`
                                : `Delete ${selectedRows.length} selected users?`}
                            {deleteTarget && (deleteTarget.orders_count ?? 0) > 0
                                ? ` This user has ${deleteTarget.orders_count} ${deleteTarget.orders_count === 1 ? "order" : "orders"} assigned and cannot be deleted.`
                                : ""}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Users.layout = {
    breadcrumbs: [{ title: "Users", href: "/users" }],
};
