<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'items_per_page',
        'theme',
        'font_size',
        'email_mfa_enabled',
        'phone_mfa_enabled',
        'timezone',
        'last_snapshot_date',
    ];

    protected $casts = [
        'email_mfa_enabled' => 'boolean',
        'phone_mfa_enabled' => 'boolean',
        'last_snapshot_date' => 'date',
    ];

    // Relationships
    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
