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

            // Product Information
            $table->string('sku')->unique();
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->string('category');
            $table->string('supplier');
            $table->string('unit')->default('Piece');

            // Inventory
            $table->integer('quantity')->default(0);
            $table->integer('minimum_stock')->default(5);

            // Pricing
            $table->decimal('cost_price', 10, 2);
            $table->decimal('selling_price', 10, 2);

            // Status
            $table->enum('status', [
                'Delivered',
                'Pending',
                'In Transit',
                'Out of Stock'
            ])->default('Pending');

            // Notes
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
