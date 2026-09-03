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
        Schema::create('action_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('action');

            $table->enum('model_type', [
                'users',
                'categories',
                'suppliers',
                'customers',
                'tags',
                'products',
                'product_tags',
                'stock_thresholds',
                'stocks',
                'stock_movements',
                'orders',
                'order_items',
                'user_settings',
            ]);

            $table->unsignedBigInteger('model_id');

            $table->text('description');

            $table->json('changes');

            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_logs');
    }
};
