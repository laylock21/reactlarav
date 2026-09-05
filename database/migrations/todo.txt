To Apply These Migrations

Option A: Fresh database (recommended for new project)
# Delete old migrations folder and rename migrations_new to migrations
# Or move the files to replace old ones
# Drop all tables and re-run
php artisan migrate:fresh

Option B: Keep existing data
# Move new migrations to migrations folder
# Run only new migrations
php artisan migrate

Next Steps
Move files from migrations_new/ to migrations/ (replace old ones)
Run php artisan migrate:fresh to create the new schema
Update models (User.php, Product.php, etc.) to match new columns