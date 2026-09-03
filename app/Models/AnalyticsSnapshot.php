<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsSnapshot extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'snapshot_date',
        'stock_quantity',
        'total_sold',
        'total_added',
        'total_removed',
        'total_revenue',
        'total_returns',
    ];

    protected $casts = [
        'snapshot_date' => 'date',
        'total_revenue' => 'decimal:2',
        'created_at' => 'timestamp',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
