<?php

namespace App\Observers;

use App\Models\AnalyticsEvent;
use App\Models\OrderItem;
use App\Models\Stock;

class AnalyticsEventObserver
{
    public function created(Stock|OrderItem $model): void
    {
        if ($model instanceof Stock) {
            $this->record(
                $model->product_id,
                match ($model->type) {
                    'stock in' => 'stock in',
                    default => 'stock adjustment',
                },
                (int) $model->quantity,
                (float) $model->quantity * (float) $model->product->selling_price,
                'stocks',
                $model->getKey()
            );

            return;
        }

        $this->record(
            $model->product_id,
            'order',
            (int) $model->quantity,
            (float) $model->total_amount,
            'order_items',
            $model->getKey()
        );
    }

    private function record(
        int $productId,
        string $eventType,
        int $quantity,
        float $amount,
        string $referenceType,
        int|string $referenceId
    ): void {
        AnalyticsEvent::create([
            'product_id' => $productId,
            'event_type' => $eventType,
            'quantity' => $quantity,
            'amount' => $amount,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'created_at' => now(),
        ]);
    }
}
