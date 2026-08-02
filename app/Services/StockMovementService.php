<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class StockMovementService
{
    public static function record(
        Product $product,
        string $type,
        int $quantity = 0,
        int $before = 0,
        int $after = 0,
        ?string $remarks = null
    ): void
    {
        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'type' => $type,
            'quantity' => $quantity,
            'before_quantity' => $before,
            'after_quantity' => $after,
            'remarks' => $remarks,
        ]);
    }
}