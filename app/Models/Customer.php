<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
    ];

    protected $casts = [
        'created_at' => 'timestamp',
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
}
