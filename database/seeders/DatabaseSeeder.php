<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        $adminId = DB::table('users')->insertGetId([
            'email' => 'admin@example.com',
            'name' => 'System Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $managerId = DB::table('users')->insertGetId([
            'email' => 'manager@example.com',
            'name' => 'Inventory Manager',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $staffId = DB::table('users')->insertGetId([
            'email' => 'staff@example.com',
            'name' => 'Inventory Staff',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $electronicsId = DB::table('categories')->insertGetId([
            'name' => 'Electronics',
            'description' => 'Electronic devices and accessories',
            'parent_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $computerPartsId = DB::table('categories')->insertGetId([
            'name' => 'Computer Parts',
            'description' => 'Components used for desktop computers',
            'parent_id' => $electronicsId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $accessoriesId = DB::table('categories')->insertGetId([
            'name' => 'Accessories',
            'description' => 'Computer and electronic accessories',
            'parent_id' => $electronicsId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $officeId = DB::table('categories')->insertGetId([
            'name' => 'Office Supplies',
            'description' => 'General office supplies and equipment',
            'parent_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Suppliers
        |--------------------------------------------------------------------------
        */

        $ibmId = DB::table('suppliers')->insertGetId([
            'name' => 'IBM',
            'contact_person' => 'John Smith',
            'phone' => '09171234567',
            'email' => 'sales@ibm.example',
            'address' => 'Makati City, Philippines',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $techSourceId = DB::table('suppliers')->insertGetId([
            'name' => 'TechSource Philippines',
            'contact_person' => 'Maria Santos',
            'phone' => '09181234567',
            'email' => 'sales@techsource.example',
            'address' => 'Quezon City, Philippines',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $officeHubId = DB::table('suppliers')->insertGetId([
            'name' => 'OfficeHub Supplies',
            'contact_person' => 'Pedro Cruz',
            'phone' => '09191234567',
            'email' => 'orders@officehub.example',
            'address' => 'Pasig City, Philippines',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Customers
        |--------------------------------------------------------------------------
        */

        $customer1Id = DB::table('customers')->insertGetId([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'phone' => '09170000001',
            'address' => 'Marikina City, Philippines',
            'created_at' => now(),
        ]);

        $customer2Id = DB::table('customers')->insertGetId([
            'name' => 'Maria Garcia',
            'email' => 'maria@example.com',
            'phone' => '09170000002',
            'address' => 'Quezon City, Philippines',
            'created_at' => now(),
        ]);

        $customer3Id = DB::table('customers')->insertGetId([
            'name' => 'ABC Computer Shop',
            'email' => 'abc@example.com',
            'phone' => '09170000003',
            'address' => 'Pasig City, Philippines',
            'created_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Tags
        |--------------------------------------------------------------------------
        */

        $tag1Id = DB::table('tags')->insertGetId([
            'name' => 'New Arrival',
            'slug' => 'new-arrival',
            'created_at' => now(),
        ]);

        $tag2Id = DB::table('tags')->insertGetId([
            'name' => 'Best Seller',
            'slug' => 'best-seller',
            'created_at' => now(),
        ]);

        $tag3Id = DB::table('tags')->insertGetId([
            'name' => 'Featured',
            'slug' => 'featured',
            'created_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Products
        |--------------------------------------------------------------------------
        */

        $laptopId = DB::table('products')->insertGetId([
            'sku' => 'LAP-001',
            'barcode' => '480000000001',
            'name' => 'Business Laptop',
            'category_id' => $computerPartsId,
            'supplier_id' => $ibmId,
            'quantity' => 25,
            'cost_price' => 30000.00,
            'selling_price' => 38000.00,
            'image_path' => null,
            'status' => 'normal stock',
            'is_active' => true,
            'description' => 'Business-class laptop for office use.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $keyboardId = DB::table('products')->insertGetId([
            'sku' => 'KEY-001',
            'barcode' => '480000000002',
            'name' => 'Mechanical Keyboard',
            'category_id' => $accessoriesId,
            'supplier_id' => $techSourceId,
            'quantity' => 8,
            'cost_price' => 1500.00,
            'selling_price' => 2200.00,
            'image_path' => null,
            'status' => 'critical stock',
            'is_active' => true,
            'description' => 'Mechanical keyboard for desktop computers.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $mouseId = DB::table('products')->insertGetId([
            'sku' => 'MOU-001',
            'barcode' => '480000000003',
            'name' => 'Wireless Mouse',
            'category_id' => $accessoriesId,
            'supplier_id' => $ibmId,
            'quantity' => 0,
            'cost_price' => 500.00,
            'selling_price' => 850.00,
            'image_path' => null,
            'status' => 'no stock',
            'is_active' => true,
            'description' => 'Wireless mouse with USB receiver.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $paperId = DB::table('products')->insertGetId([
            'sku' => 'PAP-001',
            'barcode' => '480000000004',
            'name' => 'A4 Bond Paper',
            'category_id' => $officeId,
            'supplier_id' => $officeHubId,
            'quantity' => 150,
            'cost_price' => 180.00,
            'selling_price' => 250.00,
            'image_path' => null,
            'status' => 'overstocked',
            'is_active' => true,
            'description' => 'A4 bond paper for office printing.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Product Tags
        |--------------------------------------------------------------------------
        */

        DB::table('product_tags')->insert([
            [
                'product_id' => $laptopId,
                'tag_id' => $tag1Id,
            ],
            [
                'product_id' => $laptopId,
                'tag_id' => $tag3Id,
            ],
            [
                'product_id' => $keyboardId,
                'tag_id' => $tag2Id,
            ],
            [
                'product_id' => $mouseId,
                'tag_id' => $tag2Id,
            ],
            [
                'product_id' => $paperId,
                'tag_id' => $tag1Id,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Stock Thresholds
        |--------------------------------------------------------------------------
        */

        DB::table('stock_thresholds')->insert([
            [
                'product_id' => $laptopId,
                'min_quantity' => 10,
                'max_quantity' => 50,
                'created_at' => now(),
            ],
            [
                'product_id' => $keyboardId,
                'min_quantity' => 10,
                'max_quantity' => 40,
                'created_at' => now(),
            ],
            [
                'product_id' => $mouseId,
                'min_quantity' => 10,
                'max_quantity' => 50,
                'created_at' => now(),
            ],
            [
                'product_id' => $paperId,
                'min_quantity' => 20,
                'max_quantity' => 100,
                'created_at' => now(),
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Stocks
        |--------------------------------------------------------------------------
        */

        DB::table('stocks')->insert([
            [
                'product_id' => $laptopId,
                'type' => 'stock in',
                'quantity' => 25,
                'status' => 'delivered',
                'reference_number' => 'SI-0001',
                'notes' => 'Initial stock delivery.',
                'created_at' => now(),
            ],
            [
                'product_id' => $keyboardId,
                'type' => 'stock in',
                'quantity' => 8,
                'status' => 'delivered',
                'reference_number' => 'SI-0002',
                'notes' => 'Initial stock delivery.',
                'created_at' => now(),
            ],
            [
                'product_id' => $mouseId,
                'type' => 'stock out',
                'quantity' => 10,
                'status' => 'delivered',
                'reference_number' => 'SO-0001',
                'notes' => 'Initial stock deduction.',
                'created_at' => now(),
            ],
            [
                'product_id' => $paperId,
                'type' => 'stock in',
                'quantity' => 150,
                'status' => 'delivered',
                'reference_number' => 'SI-0003',
                'notes' => 'Initial stock delivery.',
                'created_at' => now(),
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Stock Movements
        |--------------------------------------------------------------------------
        |
        | product_id is currently UNIQUE in your migration, so only one
        | movement is created per product.
        |
        */

        DB::table('stock_movements')->insert([
            [
                'product_id' => $laptopId,
                'quantity_before' => 0,
                'quantity_after' => 25,
                'quantity_change' => 25,
                'reason' => 'Initial stock',
                'created_at' => now(),
            ],
            [
                'product_id' => $keyboardId,
                'quantity_before' => 0,
                'quantity_after' => 8,
                'quantity_change' => 8,
                'reason' => 'Initial stock',
                'created_at' => now(),
            ],
            [
                'product_id' => $mouseId,
                'quantity_before' => 10,
                'quantity_after' => 0,
                'quantity_change' => -10,
                'reason' => 'Initial stock deduction',
                'created_at' => now(),
            ],
            [
                'product_id' => $paperId,
                'quantity_before' => 0,
                'quantity_after' => 150,
                'quantity_change' => 150,
                'reason' => 'Initial stock',
                'created_at' => now(),
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */

        $order1Id = DB::table('orders')->insertGetId([
            'order_number' => 'ORD-0001',
            'user_id' => $staffId,
            'customer_id' => $customer1Id,
            'customer_type' => 'in store',
            'customer_reference' => null,
            'platform' => 'shopee',
            'status' => 'delivered',
            'total_amount' => 4400.00,
            'notes' => 'Sample completed order.',
            'ordered_at' => Carbon::now()->subDays(2),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $order2Id = DB::table('orders')->insertGetId([
            'order_number' => 'ORD-0002',
            'user_id' => $managerId,
            'customer_id' => $customer2Id,
            'customer_type' => 'online',
            'customer_reference' => 'ONLINE-0001',
            'platform' => 'lazada',
            'status' => 'packed',
            'total_amount' => 38000.00,
            'notes' => 'Online order awaiting delivery.',
            'ordered_at' => Carbon::now()->subDay(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $order3Id = DB::table('orders')->insertGetId([
            'order_number' => 'ORD-0003',
            'user_id' => $staffId,
            'customer_id' => $customer3Id,
            'customer_type' => 'in store',
            'customer_reference' => null,
            'platform' => 'tiktok',
            'status' => 'out for delivery',
            'total_amount' => 6800.00,
            'notes' => 'Sample business customer order.',
            'ordered_at' => Carbon::now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Order Items
        |--------------------------------------------------------------------------
        */

        DB::table('order_items')->insert([
            [
                'order_id' => $order1Id,
                'product_id' => $keyboardId,
                'quantity' => 2,
                'unit_price' => 2200.00,
                'total_amount' => 4400.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id' => $order2Id,
                'product_id' => $laptopId,
                'quantity' => 1,
                'unit_price' => 38000.00,
                'total_amount' => 38000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id' => $order3Id,
                'product_id' => $keyboardId,
                'quantity' => 2,
                'unit_price' => 2200.00,
                'total_amount' => 4400.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id' => $order3Id,
                'product_id' => $mouseId,
                'quantity' => 1,
                'unit_price' => 850.00,
                'total_amount' => 850.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id' => $order3Id,
                'product_id' => $paperId,
                'quantity' => 6,
                'unit_price' => 250.00,
                'total_amount' => 1500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | User Settings
        |--------------------------------------------------------------------------
        */

        DB::table('user_settings')->insert([
            [
                'user_id' => $adminId,
                'items_per_page' => 20,
                'theme' => 'dark',
            ],
            [
                'user_id' => $managerId,
                'items_per_page' => 20,
                'theme' => 'light',
            ],
            [
                'user_id' => $staffId,
                'items_per_page' => 10,
                'theme' => 'light',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Action Logs
        |--------------------------------------------------------------------------
        */

        DB::table('action_logs')->insert([
            [
                'user_id' => $adminId,
                'action' => 'created',
                'model_type' => 'users',
                'model_id' => $adminId,
                'description' => 'Created administrator account.',
                'changes' => json_encode([
                    'role' => 'admin',
                    'is_active' => true,
                ]),
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $managerId,
                'action' => 'created',
                'model_type' => 'products',
                'model_id' => $laptopId,
                'description' => 'Created product Business Laptop.',
                'changes' => json_encode([
                    'quantity' => 25,
                    'selling_price' => 38000.00,
                ]),
                'created_at' => Carbon::now()->subDays(3),
            ],
            [
                'user_id' => $staffId,
                'action' => 'updated',
                'model_type' => 'stocks',
                'model_id' => $laptopId,
                'description' => 'Added initial stock for Business Laptop.',
                'changes' => json_encode([
                    'quantity' => 25,
                    'type' => 'stock in',
                ]),
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $managerId,
                'action' => 'created',
                'model_type' => 'orders',
                'model_id' => $order1Id,
                'description' => 'Created order ORD-0001.',
                'changes' => json_encode([
                    'status' => 'delivered',
                    'total_amount' => 4400.00,
                ]),
                'created_at' => Carbon::now()->subDays(2),
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Notifications
        |--------------------------------------------------------------------------
        */

        DB::table('notifications')->insert([
            [
                'type' => 'alert',
                'title' => 'Low Stock',
                'message' => 'Mechanical Keyboard is below its minimum stock threshold.',
                'action_url' => '/products/' . $keyboardId,
                'is_read' => false,
                'read_at' => null,
                'created_at' => now(),
            ],
            [
                'type' => 'warning',
                'title' => 'Out of Stock',
                'message' => 'Wireless Mouse is currently out of stock.',
                'action_url' => '/products/' . $mouseId,
                'is_read' => false,
                'read_at' => null,
                'created_at' => now(),
            ],
            [
                'type' => 'alert',
                'title' => 'Order Update',
                'message' => 'Order ORD-0002 is packed and ready for delivery.',
                'action_url' => '/orders/' . $order2Id,
                'is_read' => true,
                'read_at' => now(),
                'created_at' => Carbon::now()->subHour(),
            ],
        ]);
    }
}
