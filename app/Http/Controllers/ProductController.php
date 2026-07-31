<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('products', [
            'products' => Product::paginate(100),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|unique:products',
            'barcode' => 'nullable',
            'name' => 'required',
            'supplier' => 'required',
            'category' => 'required',
            'unit' => 'required',
            'quantity' => 'required|integer',
            'minimum_stock' => 'required|integer',
            'cost_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'status' => 'required',
            'description' => 'nullable',
        ]);

        Product::create($validated);

        return redirect()->back();
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required',
            'barcode' => 'nullable',
            'name' => 'required',
            'supplier' => 'required',
            'category' => 'required',
            'unit' => 'required',
            'quantity' => 'required|integer',
            'minimum_stock' => 'required|integer',
            'cost_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'status' => 'required',
            'description' => 'nullable',
        ]);

        $product->fill($validated);
        $product->save();

        return to_route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index');
    }
    public function movements(Product $product)
    {
        //
    }

    public function duplicate(Product $product)
    {
        $copy = $product->replicate();

        $copy->sku = $product->sku . '-COPY-' . now()->timestamp;

        $copy->barcode = null;

        $copy->save();

        return redirect()->back();
    }
    public function status(Product $product)
    {
        $statuses = [
            "Pending",
            "Delivered",
            "In Transit",
        ];

        $current = array_search($product->status, $statuses);

        $next = ($current + 1) % count($statuses);

        $product->update([
            "status" => $statuses[$next],
        ]);

        return redirect()->back();
    }

    public function archive(Product $product)
    {
        $product->update([
            'archived' => true,
        ]);

        return redirect()->back();
    }
}