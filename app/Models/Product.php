<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'supplier',
        'category',
        'unit',
        'quantity',
        'minimum_stock',
        'cost_price',
        'selling_price',
        'status',
        'description',
    ];

    protected $archived = [
    'sku',
    'barcode',
    'name',
    'supplier',
    'category',
    'unit',
    'quantity',
    'minimum_stock',
    'cost_price',
    'selling_price',
    'status',
    'archived',
    'description',
];
}