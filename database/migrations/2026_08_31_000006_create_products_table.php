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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('sku')->unique();
            $table->string('barcode')->nullable();
            $table->string('name');

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('supplier_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->integer('quantity')->default(0);

            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('selling_price', 10, 2);

            $table->text('image_path')->nullable();

            $table->enum('status', [
                'no stock',
                'critical stock',
                'normal stock',
                'overstocked',
            ]);

            $table->boolean('is_active')->default(true);

            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
