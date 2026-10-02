<?php

namespace App\Console\Commands;

use App\Models\AnalyticsEvent;
use App\Models\AnalyticsSnapshot;
use App\Models\Product;
use App\Models\UserSetting;
use Illuminate\Console\Command;

class GenerateSnapshots extends Command
{
    protected $signature = 'analytics:snapshots';

    protected $description = 'Generate analytics snapshots for all products';

    public function handle(): void
    {
        $today = now()->toDateString();
        $count = 0;

        Product::query()->orderBy('id')->chunk(200, function ($products) use ($today, &$count) {
            foreach ($products as $product) {
                if ($this->createSnapshot($product, $today)) {
                    $count++;
                }
            }
        });

        UserSetting::query()->update(['last_snapshot_date' => $today]);

        $this->info("Generated {$count} snapshots for {$today}.");
    }

    private function createSnapshot(Product $product, string $today): bool
    {
        $exists = AnalyticsSnapshot::query()
            ->where('product_id', $product->getKey())
            ->where('snapshot_date', $today)
            ->exists();

        if ($exists) {
            return false;
        }

        $lastSnapshot = AnalyticsSnapshot::query()
            ->where('product_id', $product->getKey())
            ->orderBy('snapshot_date', 'desc')
            ->first();

        $startDate = $lastSnapshot instanceof AnalyticsSnapshot
            ? $lastSnapshot->snapshot_date
            : now()->subDays(7)->toDateString();

        $events = AnalyticsEvent::query()
            ->where('product_id', $product->getKey())
            ->where('created_at', '>=', $startDate)
            ->get();

        AnalyticsSnapshot::create([
            'product_id' => $product->getKey(),
            'snapshot_date' => $today,
            'stock_quantity' => $product->quantity,
            'total_sold' => $events->where('event_type', 'order')->sum('quantity'),
            'total_added' => $events->where('event_type', 'stock in')->sum('quantity'),
            'total_removed' => $events->where('event_type', 'stock adjustment')->sum('quantity'),
            'total_revenue' => $events->where('event_type', 'order')->sum('amount'),
            'total_returns' => $events->where('event_type', 'return')->sum('quantity'),
            'created_at' => now(),
        ]);

        return true;
    }
}
