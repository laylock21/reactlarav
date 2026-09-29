<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Passkeys\PasskeyAuthenticatable;

class User extends Authenticatable
{
    use PasskeyAuthenticatable;
    use TwoFactorAuthenticatable;

    protected static function booted(): void
    {
        // user_settings is never created by the database itself, so seed
        // a default row on registration instead of null-checking
        // $user->settings across the codebase.
        static::created(function (User $user) {
            $user->settings()->firstOrCreate([], [
                'items_per_page' => 20,
                'theme' => 'light',
                'font_size' => 'medium',
                'email_mfa_enabled' => false,
                'phone_mfa_enabled' => false,
            ]);
        });
    }

    protected $fillable = [
        'email',
        'name',
        'password',
        'role',
        'is_active',
        'phone_number',
        'address',
        'avatar_path',
    ];

    protected $hidden = [
        'password',
    ];

    protected $appends = [
        'avatar',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Public URL for the profile photo, consumed by the sidebar avatar
     * and the profile page. Null when no photo was uploaded.
     */
    protected function avatar(): Attribute
    {
        return Attribute::get(
            fn () => $this->avatar_path ? asset('storage/'.$this->avatar_path) : null
        );
    }

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function settings()
    {
        return $this->hasOne(UserSetting::class, 'user_id');
    }

    public function actionLogs()
    {
        return $this->hasMany(ActionLog::class, 'user_id');
    }
}
