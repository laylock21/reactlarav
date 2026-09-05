


Schema::create('users', function (Blueprint $table) {
    $table->id();

    $table->string('email')->unique();
    $table->string('name');
    $table->string('password');

    $table->enum('role', [
        // Define roles here
    ]);

    $table->boolean('is_active')->default(true);

    $table->timestamps();
});

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

Schema::create('suppliers', function (Blueprint $table) {
    $table->id();

    $table->string('name')->unique();
    $table->string('contact_person')->nullable();
    $table->string('phone')->nullable();
    $table->string('email')->nullable();
    $table->text('address')->nullable();

    $table->timestamps();
});

Schema::create('customers', function (Blueprint $table) {
    $table->id();

    $table->string('name');
    $table->string('email');
    $table->string('phone');
    $table->string('address');

    $table->timestamp('created_at');
});

Schema::create('tags', function (Blueprint $table) {
    $table->id();

    $table->string('name')->unique();
    $table->string('slug')->unique();

    $table->timestamp('created_at');
});

Schema::create('products', function (Blueprint $table) {
    $table->id();

    $table->string('sku')->unique();
    $table->string('barcode')->nullable();
    $table->string('name');

    $table->foreignId('category_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->foreignId('supplier_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->integer('quantity')->default(0);

    $table->decimal('cost_price', 10, 2)->nullable();
    $table->decimal('selling_price', 10, 2);

    $table->text('image_path')->nullable();

    // Define ENUM values
    $table->enum('status', [
        // ...
    ]);

    // Schema currently defines this as ENUM
    $table->enum('is_active', [
        // ...
    ]);

    $table->text('description')->nullable();

    $table->timestamps();
});

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

Schema::create('orders', function (Blueprint $table) {
    $table->id();

    $table->string('order_number')->unique();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->foreignId('customer_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->enum('customer_type', [
        // Define values
    ]);

    $table->string('customer_reference')->nullable();

    $table->enum('platform', [
        // Define values
    ]);

    $table->enum('status', [
        // Define values
    ]);

    $table->decimal('total_amount', 10, 2);

    $table->text('notes')->nullable();

    $table->timestamp('ordered_at');

    $table->timestamps();
});

Schema::create('order_items', function (Blueprint $table) {
    $table->id();

    $table->foreignId('order_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->foreignId('product_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->integer('quantity');

    $table->decimal('unit_price', 10, 2);

    $table->decimal('total_amount', 10, 2);

    $table->timestamps();
});

Schema::create('analytics_events', function (Blueprint $table) {
    $table->id();

    $table->foreignId('product_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->enum('event_type', [
        // Define values
    ]);

    $table->integer('quantity');

    $table->decimal('amount', 10, 2)->nullable();

    $table->string('reference_type');
    $table->unsignedBigInteger('reference_id');

    $table->timestamp('created_at');
});

Schema::create('analytics_snapshots', function (Blueprint $table) {
    $table->id();

    $table->foreignId('product_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->date('snapshot_date');

    $table->integer('stock_quantity');
    $table->integer('total_sold');
    $table->integer('total_added');
    $table->integer('total_removed');

    $table->decimal('total_revenue', 10, 2);

    $table->integer('total_returns');

    $table->timestamp('created_at');
});

Schema::create('user_settings', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->unique()
        ->constrained()
        ->cascadeOnUpdate()
        ->cascadeOnDelete();

    $table->integer('items_per_page');

    $table->enum('theme', [
        // Define values
    ]);
});

Schema::create('action_logs', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->string('action');

    $table->enum('model_type', [
        // Define values
    ]);

    $table->unsignedBigInteger('model_id');

    $table->text('description');

    $table->json('changes');

    $table->timestamp('created_at');
});

Schema::create('notifications', function (Blueprint $table) {
    $table->id();

    $table->enum('type', [
        // Define values
    ]);

    $table->string('title');
    $table->text('message');
    $table->string('action_url');

    $table->boolean('is_read')->default(false);

    $table->timestamp('read_at')->nullable();
    $table->timestamp('created_at');
});