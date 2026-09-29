<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->integer('items_per_page');

            $table->enum('theme', [
                'dark',
                'light',
                'system',
            ]);

            $table->enum('font_size', [
                'small',
                'medium',
                'large',
            ])->default('medium');

            $table->boolean('email_mfa_enabled')->default(false);
            $table->boolean('phone_mfa_enabled')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
