<?php

namespace App\Observers;

use App\Models\Notification;
use App\Models\Order;

class OrderStatusObserver
{
    public function updated(Order $order): void
    {
        if (! $order->wasChanged('status')) {
            return;
        }

        Notification::create([
            'type' => 'alert',
            'title' => 'Order Status Updated',
            'message' => "Order {$order->order_number} status changed to {$order->status}.",
            'action_url' => "/orders/{$order->getKey()}",
            'created_at' => now(),
        ]);
    }
}
