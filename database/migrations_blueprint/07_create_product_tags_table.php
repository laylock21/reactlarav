Schema::create('product_tags', function (Blueprint $table) {
    $table->foreignId('product_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->foreignId('tag_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->primary([
        'product_id',
        'tag_id',
    ]);
});