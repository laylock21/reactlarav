import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppearanceTabs from '@/components/settings/appearance-tabs';
import FontSizeTabs from '@/components/settings/font-size-tabs';
import Heading from '@/components/archive/heading';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import type { FontSize } from '@/hooks/use-font-size';
import { useFontSize } from '@/hooks/use-font-size';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { edit as editAppearance } from '@/routes/appearance';

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

type Props = {
    settings: {
        theme: Appearance;
        font_size: FontSize;
        items_per_page: number;
    };
};

export default function Appearance({ settings }: Props) {
    const { appearance, syncAppearance } = useAppearance();
    const { fontSize, syncFontSize } = useFontSize();
    const [perPage, setPerPage] = useState<number>(settings.items_per_page);

    // The database is the source of truth: on visit, adopt the saved
    // values when they differ from this browser's local state. Sync is
    // deliberately persistence-free: firing a PUT per drifted value
    // races (last response wins) and can overwrite the saved row with
    // stale local values. Only explicit user gestures persist.
    useEffect(() => {
        if (settings.theme !== appearance) {
            syncAppearance(settings.theme);
        }

        if (settings.font_size !== fontSize) {
            syncFontSize(settings.font_size);
        }

        setPerPage(settings.items_per_page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update the appearance settings for your account"
                />
                <AppearanceTabs />
            </div>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Font size"
                    description="Scale text across the whole system (small, medium, large)"
                />
                <FontSizeTabs />
                <p className="text-sm text-muted-foreground">
                    Sizes apply through the root font size, which works
                    because all type (including headings 1-6) is sized in
                    rem. Changes save to your account automatically.
                </p>
            </div>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Rows per page"
                    description="How many rows tables show before paginating"
                />
                <div className="space-y-2">
                    <Label htmlFor="items-per-page">Rows per page</Label>
                    <Select
                        value={perPage.toString()}
                        onValueChange={(value) => {
                            const next = Number(value);
                            setPerPage(next);
                            router.put(
                                '/settings/appearance',
                                { items_per_page: next },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    replace: true,
                                    onSuccess: () => toast.success(`Tables will now show ${next} rows per page.`),
                                    onError: () => toast.error('Unable to save rows per page.'),
                                },
                            );
                        }}
                    >
                        <SelectTrigger id="items-per-page" className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PER_PAGE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option} rows
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
