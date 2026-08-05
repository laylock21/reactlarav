    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        /**
         * Run the migrations.
         */
        public function up(): void
        {
            if (! Schema::hasTable('stock_movements')) {
                return;
            }

            if (! Schema::hasColumn('stock_movements', 'before_data')) {
                Schema::table('stock_movements', function (Blueprint $table) {
                    $table->json('before_data')->nullable();
                });
            }

            if (! Schema::hasColumn('stock_movements', 'after_data')) {
                Schema::table('stock_movements', function (Blueprint $table) {
                    $table->json('after_data')->nullable();
                });
            }
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            if (! Schema::hasTable('stock_movements')) {
                return;
            }

            if (Schema::hasColumn('stock_movements', 'before_data')) {
                Schema::table('stock_movements', function (Blueprint $table) {
                    $table->dropColumn('before_data');
                });
            }

            if (Schema::hasColumn('stock_movements', 'after_data')) {
                Schema::table('stock_movements', function (Blueprint $table) {
                    $table->dropColumn('after_data');
                });
            }
        }
    };
