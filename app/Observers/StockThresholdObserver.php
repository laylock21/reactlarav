<?php

namespace App\Observers;

use App\Models\Notification;
use App\Models\Product;

class StockThresholdObserver
{
    /**
     * Watch Product (not Stock): stock rows are append-only ledger
     * entries, while product.quantity is the live value controllers
     * actually change. Fires only when the quantity itself moved.
     */
    public function updated(Product $product): void
    {
        if (! $product->wasChanged('quantity')) {
            return;
        }

        $threshold = $product->stockThreshold;

        if ($threshold === null) {
            return;
        }

        $quantity = (int) $product->quantity;

        if ($quantity === 0) {
            $this->notify(
                'alert',
                'Out of Stock',
                "{$product->name} is now out of stock.",
                "/products/{$product->getKey()}"
            );

            return;
        }

        if ($quantity <= (int) $threshold->min_quantity) {
            $this->notify(
                'warning',
                'Low Stock Alert',
                "{$product->name} is below minimum stock threshold ({$quantity}/{$threshold->min_quantity}).",
                "/products/{$product->getKey()}"
            );

            return;
        }

        if ($threshold->max_quantity !== null && $quantity >= (int) $threshold->max_quantity) {
            $this->notify(
                'warning',
                'Overstock Alert',
                "{$product->name} has exceeded maximum stock ({$quantity}/{$threshold->max_quantity}).",
                "/products/{$product->getKey()}"
            );
        }
    }

    private function notify(string $type, string $title, string $message, string $url): void
    {
        // Dedupe: don't stack an identical unread notification.
        $exists = Notification::query()
            ->where('is_read', false)
            ->where('type', $type)
            ->where('title', $title)
            ->where('action_url', $url)
            ->exists();

        if ($exists) {
            return;
        }

        Notification::create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $url,
            'created_at' => now(),
        ]);
    }
}
