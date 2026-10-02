<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected static function booted(): void
    {
        // The table carries a non-nullable created_at but no updated_at,
        // so stamp it here instead of enabling full timestamps. Stored
        // as an integer to match the timestamp cast.
        static::creating(function (Customer $customer) {
            $customer->created_at ??= time();
        });
    }

    // Relationships
    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
}
