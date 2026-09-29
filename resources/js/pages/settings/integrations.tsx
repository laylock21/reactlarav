import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import Heading from '@/components/archive/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const platforms = [
    {
        id: 'shopee',
        name: 'Shopee',
        description: 'Sync orders and product listings with your Shopee shop.',
    },
    {
        id: 'lazada',
        name: 'Lazada',
        description: 'Sync orders and product listings with your Lazada store.',
    },
    {
        id: 'tiktok',
        name: 'TikTok Shop',
        description: 'Sync orders and product listings with your TikTok Shop.',
    },
];

export default function Integrations() {
    return (
        <>
            <Head title="Integration settings" />

            <h1 className="sr-only">Integration settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Integrations"
                    description="Connect your sales platforms to sync orders and listings"
                />

                <div className="space-y-4">
                    {platforms.map((platform) => (
                        <Card key={platform.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle>{platform.name}</CardTitle>
                                <Badge variant="secondary">Not connected</Badge>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{platform.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        toast.info(`${platform.name} integration is not available yet.`, {
                                            description: 'Platform connection will be wired up with the backend.',
                                        })
                                    }
                                >
                                    Connect
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

Integrations.layout = {
    breadcrumbs: [
        {
            title: 'Integration settings',
            href: '/settings/integrations',
        },
    ],
};
