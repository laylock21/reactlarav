Schema::create('categories', function (Blueprint $table) {
    $table->id();

    $table->string('name')->unique();
    $table->text('description')->nullable();

    $table->foreignId('parent_id')
        ->nullable()
        ->constrained('categories')
        ->nullOnDelete();

    $table->timestamps();
});