import type { HTMLAttributes } from 'react';
import type { FontSize } from '@/hooks/use-font-size';
import { useFontSize } from '@/hooks/use-font-size';
import { cn } from '@/lib/utils';

export default function FontSizeTabs({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { fontSize, updateFontSize } = useFontSize();

    const tabs: { value: FontSize; label: string }[] = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => updateFontSize(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        fontSize === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <span className="ml-1.5 text-sm">
                        {label}
                        {value === 'medium' && ' (default)'}
                    </span>
                </button>
            ))}
        </div>
    );
}
