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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('order_number')->unique();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('customer_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->enum('customer_type', [
                'online',
                'in store',
            ]);

            $table->string('customer_reference')->nullable();

            $table->enum('platform', [
                'shopee',
                'tiktok',
                'lazada',
            ]);

            $table->enum('status', [
                'packed',
                'out for delivery',
                'delivered',
            ]);

            $table->decimal('total_amount', 10, 2);

            $table->text('notes')->nullable();

            $table->timestamp('ordered_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
