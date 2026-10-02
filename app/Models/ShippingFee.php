<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingFee extends Model
{
    protected $fillable = [
        'channel_name',
        'weight_range',
        'fee',
    ];

    protected $casts = [
        'fee' => 'decimal:2',
    ];
}
