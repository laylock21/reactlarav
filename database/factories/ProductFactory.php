<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $statuses = [
            'Delivered',
            'Pending',
            'In Transit',
            'Out of Stock',
        ];

        return [

            'sku' => strtoupper(fake()->bothify('P###')),

            'barcode' => fake()->ean13(),

            'name' => fake()->words(2, true),

            'category' => fake()->randomElement([
                'Mouse',
                'Keyboard',
                'Monitor',
                'Laptop',
                'Printer',
                'Storage',
            ]),

            'supplier' => fake()->company(),

            'unit' => 'Piece',

            'quantity' => fake()->numberBetween(0,150),

            'minimum_stock' => fake()->numberBetween(5,20),

            'cost_price' => fake()->randomFloat(2,100,5000),

            'selling_price' => fake()->randomFloat(2,200,7000),

            'status' => fake()->randomElement($statuses),

            'description' => fake()->sentence(),

        ];
    }
}