<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropUnique(['product_id']);
            $table->foreignId('user_id')->nullable()->after('product_id')->constrained()->nullOnDelete();
            $table->string('type')->default('STOCK_ADJUSTMENT')->after('user_id');
            $table->integer('quantity')->default(0)->after('type');
            $table->integer('before_quantity')->default(0)->after('quantity');
            $table->integer('after_quantity')->default(0)->after('before_quantity');
            $table->json('before_data')->nullable()->after('after_quantity');
            $table->json('after_data')->nullable()->after('before_data');
            $table->text('remarks')->nullable()->after('after_data');
        });

        DB::table('stock_movements')->orderBy('id')->eachById(function ($movement) {
            DB::table('stock_movements')->where('id', $movement->id)->update([
                'quantity' => $movement->quantity_change,
                'before_quantity' => $movement->quantity_before,
                'after_quantity' => $movement->quantity_after,
                'remarks' => $movement->reason,
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'type',
                'quantity',
                'before_quantity',
                'after_quantity',
                'before_data',
                'after_data',
                'remarks',
            ]);
            $table->unique('product_id');
        });
    }
};
