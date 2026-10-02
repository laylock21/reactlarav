<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Passkeys\Contracts\PasskeyUser;
use Laravel\Passkeys\PasskeyAuthenticatable;

class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use Notifiable;
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
        'current_session_id',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
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
    public function getAvatarAttribute(): ?string
    {
        return $this->avatar_path ? asset('storage/'.$this->avatar_path) : null;
    }

    // Relationships
    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    /** @return HasOne<UserSetting, $this> */
    public function settings(): HasOne
    {
        return $this->hasOne(UserSetting::class, 'user_id');
    }

    /** @return HasMany<ActionLog, $this> */
    public function actionLogs(): HasMany
    {
        return $this->hasMany(ActionLog::class, 'user_id');
    }
}
