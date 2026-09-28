<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change categories.parent_id from NULL ON DELETE to RESTRICT ON DELETE.
     *
     * Deleting a parent category must not silently promote its
     * subcategories to top-level rows. The application layer
     * (CategoryController::destroy) rejects such deletes with an
     * explanatory message; this constraint is the database-level
     * safety net underneath it.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            $this->rebuildSqliteTable('RESTRICT');
        } else {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropForeign(['parent_id']);
            });

            Schema::table('categories', function (Blueprint $table) {
                $table->foreign('parent_id')
                    ->references('id')
                    ->on('categories')
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            $this->rebuildSqliteTable('SET NULL');
        } else {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropForeign(['parent_id']);
            });

            Schema::table('categories', function (Blueprint $table) {
                $table->foreign('parent_id')
                    ->references('id')
                    ->on('categories')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();
            });
        }
    }

    /**
     * SQLite cannot alter foreign keys in place, so rebuild the table
     * with the desired ON DELETE rule while preserving existing rows.
     * The foreign key references the final table name on purpose:
     * enforcement is off during the rebuild and SQLite resolves the
     * parent table by name once the renamed table is in place.
     */
    private function rebuildSqliteTable(string $onDelete): void
    {
        $rule = strtoupper($onDelete) === 'RESTRICT' ? 'RESTRICT' : 'SET NULL';

        DB::statement('PRAGMA foreign_keys = OFF');

        try {
            DB::statement(
                "CREATE TABLE categories_new (
                    id integer primary key autoincrement not null,
                    name varchar(255) not null unique,
                    description text null,
                    parent_id integer null,
                    created_at timestamp null,
                    updated_at timestamp null,
                    FOREIGN KEY (parent_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE {$rule}
                )"
            );

            DB::statement(
                'INSERT INTO categories_new (id, name, description, parent_id, created_at, updated_at)
                 SELECT id, name, description, parent_id, created_at, updated_at FROM categories'
            );

            Schema::drop('categories');
            Schema::rename('categories_new', 'categories');

            DB::statement('CREATE INDEX categories_parent_id_index ON categories (parent_id)');
        } finally {
            DB::statement('PRAGMA foreign_keys = ON');
        }
    }
};
