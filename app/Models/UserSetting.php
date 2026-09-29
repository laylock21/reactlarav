<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'email_mfa_enabled' => 'boolean',
        'phone_mfa_enabled' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
