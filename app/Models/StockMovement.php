<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity',
        'before_quantity',
        'after_quantity',
        'before_data',
        'after_data',
        'remarks',
    ];

    protected $casts = [
        'before_data' => 'array',
        'after_data' => 'array',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // The table still carries the legacy non-nullable columns
        // (quantity_before/after/change, reason, created_at) alongside
        // the newer ledger fields. Backfill them here so every write
        // path stays working without touching each call site.
        static::creating(function (StockMovement $movement) {
            $movement->created_at ??= now();
            $movement->quantity_before ??= $movement->before_quantity ?? 0;
            $movement->quantity_after ??= $movement->after_quantity ?? 0;
            $movement->quantity_change ??= $movement->quantity_after - $movement->quantity_before;
            $movement->reason ??= $movement->remarks ?? $movement->type ?? 'stock movement';
        });
    }

    // Relationships
    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
