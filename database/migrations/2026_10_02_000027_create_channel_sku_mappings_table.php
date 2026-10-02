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
        Schema::create('channel_sku_mappings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('channel_name');
            $table->string('channel_product_id');
            $table->string('channel_sku_id')->nullable();
            $table->string('channel_shop_sku')->nullable();
            $table->boolean('is_synced')->default(false);

            $table->timestamps();

            $table->unique(['product_id', 'channel_name', 'channel_product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_sku_mappings');
    }
};
