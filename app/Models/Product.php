<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'category_id',
        'supplier_id',
        'quantity',
        'cost_price',
        'selling_price',
        'image_path',
        'status',
        'is_active',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tags', 'product_id', 'tag_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'product_id');
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'product_id');
    }

    public function stockThreshold()
    {
        return $this->hasOne(StockThreshold::class, 'product_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }

    public function analyticsEvents()
    {
        return $this->hasMany(AnalyticsEvent::class, 'product_id');
    }

    public function analyticsSnapshots()
    {
        return $this->hasMany(AnalyticsSnapshot::class, 'product_id');
    }
}
