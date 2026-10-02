<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    // The table carries a non-nullable created_at but no updated_at.
    public $timestamps = false;

    protected $fillable = [
        'name',
        'slug',
    ];

    // Relationships
    /** @return BelongsToMany<Product, $this> */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_tags', 'tag_id', 'product_id');
    }

    protected static function booted(): void
    {
        static::creating(function (Tag $tag) {
            $tag->created_at ??= now();

            if (empty($tag->slug) && ! empty($tag->name)) {
                $base = Str::slug($tag->name) ?: 'tag';
                $slug = $base;
                $counter = 2;

                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$counter}";
                    $counter++;
                }

                $tag->slug = $slug;
            }
        });
    }
}
