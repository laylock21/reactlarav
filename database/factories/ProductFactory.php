<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sku' => 'P'.str_pad((string) $this->faker->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),

            'barcode' => fake()->ean13(),

            'name' => fake()->words(2, true),

            'category_id' => Category::query()->inRandomOrder()->value('id')
                ?? Category::create(['name' => 'Factory Category'])->id,

            'supplier_id' => Supplier::query()->inRandomOrder()->value('id')
                ?? Supplier::create(['name' => 'Factory Supplier'])->id,

            'quantity' => fake()->numberBetween(0, 150),

            'cost_price' => fake()->randomFloat(2, 100, 5000),

            'selling_price' => fake()->randomFloat(2, 200, 7000),

            'image_path' => null,

            'status' => fake()->randomElement([
                'no stock',
                'critical stock',
                'normal stock',
                'overstocked',
            ]),

            'is_active' => true,

            'description' => fake()->sentence(),
        ];
    }
}
