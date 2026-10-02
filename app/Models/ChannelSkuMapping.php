<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChannelSkuMapping extends Model
{
    protected $fillable = [
        'product_id',
        'channel_name',
        'channel_product_id',
        'channel_sku_id',
        'channel_shop_sku',
        'is_synced',
    ];

    protected $casts = [
        'is_synced' => 'boolean',
    ];

    // Relationships
    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
