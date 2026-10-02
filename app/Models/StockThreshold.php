<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockThreshold extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'min_quantity',
        'max_quantity',
    ];

    protected $casts = [
        'created_at' => 'timestamp',
    ];

    // Relationships
    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
