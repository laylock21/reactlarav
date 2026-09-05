<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
