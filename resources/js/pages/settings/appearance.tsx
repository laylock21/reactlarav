import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AppearanceTabs from '@/components/settings/appearance-tabs';
import FontSizeTabs from '@/components/settings/font-size-tabs';
import Heading from '@/components/archive/heading';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import type { FontSize } from '@/hooks/use-font-size';
import { useFontSize } from '@/hooks/use-font-size';
import { edit as editAppearance } from '@/routes/appearance';

type Props = {
    settings: {
        theme: Appearance;
        font_size: FontSize;
    };
};

export default function Appearance({ settings }: Props) {
    const { appearance, updateAppearance } = useAppearance();
    const { fontSize, updateFontSize } = useFontSize();

    // The database is the source of truth: on visit, adopt the saved
    // values when they differ from this browser's local state.
    useEffect(() => {
        if (settings.theme !== appearance) {
            updateAppearance(settings.theme);
        }

        if (settings.font_size !== fontSize) {
            updateFontSize(settings.font_size);
        }
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
