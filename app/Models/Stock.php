<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'status',
        'reference_number',
        'notes',
        'created_at',
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
