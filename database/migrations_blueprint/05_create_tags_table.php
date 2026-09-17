Schema::create('tags', function (Blueprint $table) {
    $table->id();

    $table->string('name')->unique();
    $table->string('slug')->unique();

    $table->timestamp('created_at');
});