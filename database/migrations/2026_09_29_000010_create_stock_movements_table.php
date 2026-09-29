<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Ledger shape already includes the align-stock-movements columns
     * (user attribution, typed entries, before/after snapshots), so
     * fresh installs land directly on the current structure.
     */
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('type')->default('STOCK_ADJUSTMENT');
            $table->integer('quantity')->default(0);
            $table->integer('before_quantity')->default(0);
            $table->integer('after_quantity')->default(0);
            $table->json('before_data')->nullable();
            $table->json('after_data')->nullable();
            $table->text('remarks')->nullable();

            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->integer('quantity_change');

            $table->text('reason');

            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
