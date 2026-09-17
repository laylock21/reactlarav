Schema::create('stocks', function (Blueprint $table) {
    $table->id();

    $table->foreignId('product_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->enum('type', [
        // ...
    ]);

    $table->integer('quantity');

    $table->enum('status', [
        // ...
    ]);

    $table->string('reference_number')->nullable();
    $table->text('notes')->nullable();

    $table->timestamp('created_at');
});