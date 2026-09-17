Schema::create('customers', function (Blueprint $table) {
    $table->id();

    $table->string('name');
    $table->string('email');
    $table->string('phone');
    $table->string('address');

    $table->timestamp('created_at');
});