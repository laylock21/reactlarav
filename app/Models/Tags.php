<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    public $timestamps = false;

    protected $table = 'tags';

    protected $fillable = [
        'name',
        'slug',
    ];

    protected $casts = [
        'created_at' => 'timestamp',
    ];

    // Relationships
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_tags', 'tag_id', 'product_id');
    }
}
