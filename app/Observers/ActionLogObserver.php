<?php

namespace App\Observers;

use App\Models\ActionLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ActionLogObserver
{
    /**
     * Attributes that must never land in an action log.
     *
     * @var list<string>
     */
    private const SENSITIVE = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    public function created(Model $model): void
    {
        $this->log($model, 'created');
    }

    public function updated(Model $model): void
    {
        $this->log($model, 'updated');
    }

    public function deleted(Model $model): void
    {
        // A log row references its actor via non-nullable, RESTRICTed
        // user_id: logging a user's own deletion would violate its own
        // foreign key, so user deletions go unlogged by design.
        if ($model instanceof User) {
            return;
        }

        $this->log($model, 'deleted');
    }

    private function log(Model $model, string $action): void
    {
        // Seeding and console commands run without a user; the
        // action_logs.user_id column is NOT NULL, so skip instead of
        // failing the whole operation. Self-registration is the one
        // exception: the new user is its own actor.
        $userId = Auth::id() ?? ($model instanceof User ? $model->getKey() : null);

        if ($userId === null) {
            return;
        }

        // action_logs.model_type stores plural table-style names
        // ('products', 'order_items'), NOT bare class names.
        $type = Str::plural(Str::snake(class_basename($model)));

        ActionLog::create([
            'user_id' => $userId,
            'action' => $action,
            'model_type' => $type,
            'model_id' => $model->getKey(),
            'description' => $this->getDescription($model, $action),
            'changes' => $this->getChanges($model, $action),
            'created_at' => now(),
        ]);
    }

    private function getDescription(Model $model, string $action): string
    {
        $name = $model->getAttribute('name')
            ?? $model->getAttribute('sku')
            ?? $model->getAttribute('order_number')
            ?? 'record';

        return "{$action} ".class_basename($model).": {$name}";
    }

    /**
     * @return array<string, mixed>
     */
    private function getChanges(Model $model, string $action): array
    {
        // The changes column is non-nullable JSON: never return null.
        // Scrub secrets even though the model $hidden list exists, since
        // toArray() on some models (e.g. User) still carries them here.
        $scrub = fn (array $attributes): array => array_diff_key(
            $attributes,
            array_flip(self::SENSITIVE)
        );

        return match ($action) {
            'created' => $scrub($model->toArray()),
            'updated' => $scrub($model->getChanges()),
            default => [],
        };
    }
}
