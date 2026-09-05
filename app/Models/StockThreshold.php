<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
