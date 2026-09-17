Schema::create('stock_thresholds', function (Blueprint $table) {
    $table->id();

    $table->foreignId('product_id')
        ->unique()
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->integer('min_quantity');
    $table->integer('max_quantity')->nullable();

    $table->timestamp('created_at');
});