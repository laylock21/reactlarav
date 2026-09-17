Schema::create('suppliers', function (Blueprint $table) {
    $table->id();

    $table->string('name')->unique();
    $table->string('contact_person')->nullable();
    $table->string('phone')->nullable();
    $table->string('email')->nullable();
    $table->text('address')->nullable();

    $table->timestamps();
});