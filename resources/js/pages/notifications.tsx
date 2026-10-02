import { Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AppNotification = {
    id: number;
    type: string;
    title: string;
    message: string;
    action_url: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
};

type Props = {
    notifications: {
        data: AppNotification[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    unreadCount: number;
    filters?: { unread?: boolean };
};

export default function Notifications({ notifications: notificationList, unreadCount, filters }: Props) {
    const showingUnreadOnly = filters?.unread ?? false;

    const markAsRead = (notification: AppNotification) => {
        if (notification.is_read) {
            return;
        }

        router.patch(`/notifications/${notification.id}/read`, {}, {
            preserveScroll: true,
            onError: () => toast.error("Unable to mark notification as read."),
        });
    };

    const markAllAsRead = () => {
        router.patch("/notifications/read-all", {}, {
            preserveScroll: true,
            onSuccess: () => toast.success("All notifications marked as read."),
            onError: () => toast.error("Unable to mark notifications as read."),
        });
    };

    const deleteNotification = (notification: AppNotification) => {
        router.delete(`/notifications/${notification.id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success("Notification deleted."),
            onError: () => toast.error("Unable to delete notification."),
        });
    };

    return (
        <>
            <Head title="Notifications" />
            <div className="space-y-6 p-6 h-screen flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Checkbox
                                id="unread-only"
                                checked={showingUnreadOnly}
                                onCheckedChange={(checked) =>
                                    router.get("/notifications", checked ? { unread: 1 } : {}, { preserveState: true, replace: true })
                                }
                            />
                            <label htmlFor="unread-only" className="text-muted-foreground">Unread only</label>
                        </div>
                        <Button variant="outline" size="sm" disabled={unreadCount === 0} onClick={markAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    </div>
                </div>
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Bell className="h-4 w-4" />
                            Alerts from stock thresholds and order updates
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="overflow-x-auto h-full">
                            <div className="flex-1 min-w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow className="border-b last:border-0">
                                            <TableHead>Notification</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Received</TableHead>
                                            <TableHead className="w-16" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {notificationList.data.map((notification) => (
                                            <TableRow
                                                key={notification.id}
                                                className={`border-b border-slate-200 dark:border-slate-800 ${notification.is_read ? "" : "bg-muted/40"}`}
                                            >
                                                <TableCell>
                                                    <Link
                                                        href={notification.action_url}
                                                        className={`hover:underline ${notification.is_read ? "" : "font-medium"}`}
                                                        onClick={() => markAsRead(notification)}
                                                    >
                                                        {notification.title}
                                                    </Link>
                                                    <p className="truncate text-sm text-muted-foreground max-w-md">
                                                        {notification.message}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={notification.type === "alert" ? "destructive" : "secondary"} className="capitalize">
                                                        {notification.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {!notification.is_read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label={`Mark "${notification.title}" as read`}
                                                                onClick={() => markAsRead(notification)}
                                                            >
                                                                <CheckCheck className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Delete "${notification.title}"`}
                                                            onClick={() => deleteNotification(notification)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {notificationList.data.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                    No notifications found.
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
                        Page {notificationList.current_page} of {notificationList.last_page}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!notificationList.prev_page_url}
                            onClick={() => notificationList.prev_page_url && router.get(notificationList.prev_page_url)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!notificationList.next_page_url}
                            onClick={() => notificationList.next_page_url && router.get(notificationList.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [{ title: "Notifications", href: "/notifications" }],
};
