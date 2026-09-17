Schema::create('stock_movements', function (Blueprint $table) {
    $table->id();

    $table->foreignId('product_id')
        ->unique()
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->integer('quantity_before');
    $table->integer('quantity_after');
    $table->integer('quantity_change');

    $table->text('reason');

    $table->timestamp('created_at');
});