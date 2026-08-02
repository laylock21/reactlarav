public function up(): void
{
    Schema::create('stock_movements', function (Blueprint $table) {
        $table->id();

        $table->foreignId('product_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('user_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->string('type');

        $table->integer('quantity')->default(0);

        $table->integer('before_quantity')->default(0);

        $table->integer('after_quantity')->default(0);

        $table->text('remarks')->nullable();

        $table->timestamps();
    });
}