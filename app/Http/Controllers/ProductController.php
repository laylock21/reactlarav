<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('products', [
            'products' => Product::paginate(10),
        ]);
    }
    public function movements(Product $product)
    {
        //
    }

    public function duplicate(Product $product)
    {
        //
    }

    public function status(Product $product)
    {
        //
    }

    public function archive(Product $product)
    {
        //
    }
}