import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/archive/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const notificationOptions = [
    {
        id: 'low-stock',
        title: 'Low stock alerts',
        description: 'Notify me when a product falls below its minimum stock threshold.',
    },
    {
        id: 'out-of-stock',
        title: 'Out of stock alerts',
        description: 'Notify me when a product runs out of stock.',
    },
    {
        id: 'order-updates',
        title: 'Order updates',
        description: 'Notify me when an order is created, packed, or delivered.',
    },
];

export default function Notifications() {
    const [enabled, setEnabled] = useState<string[]>(notificationOptions.map((option) => option.id));

    const toggle = (id: string, checked: boolean | 'indeterminate') => {
        setEnabled((current) => (checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)));
    };

    return (
        <>
            <Head title="Notification settings" />

            <h1 className="sr-only">Notification settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Notifications"
                    description="Choose which events you want to be notified about"
                />

                <div className="space-y-4">
                    {notificationOptions.map((option) => (
                        <div key={option.id} className="flex items-start gap-3 rounded-md border p-4">
                            <Checkbox
                                id={option.id}
                                checked={enabled.includes(option.id)}
                                onCheckedChange={(checked) => toggle(option.id, checked)}
                            />
                            <div className="space-y-1">
                                <Label htmlFor={option.id}>{option.title}</Label>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() =>
                            toast.info('Notification preferences are not saved yet.', {
                                description: 'Persistence will be wired up with the backend.',
                            })
                        }
                    >
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [
        {
            title: 'Notification settings',
            href: '/settings/notifications',
        },
    ],
};
