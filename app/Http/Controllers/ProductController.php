<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('products', [
            'products' => Product::paginate(100),
        ]);
    }
    public function exportPdf()
    {
        $products = Product::all();

        $pdf = Pdf::loadView(
            'exports.products',
            compact('products')
        );

        return $pdf->download('products.pdf');
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
    public function exportCsv(): StreamedResponse
    {
        $products = Product::all();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=products.csv',
        ];

        return response()->stream(function () use ($products) {

            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'SKU',
                'Barcode',
                'Product',
                'Supplier',
                'Category',
                'Stock',
                'Status',
                'Cost Price',
                'Selling Price',
            ]);

            foreach ($products as $product) {

                fputcsv($file, [
                    $product->sku,
                    $product->barcode,
                    $product->name,
                    $product->supplier,
                    $product->category,
                    $product->quantity,
                    $product->status,
                    $product->cost_price,
                    $product->selling_price,
                ]);

            }

            fclose($file);

        },200,$headers);
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
    public function status(Request $request, Product $product)
    {
        $request->validate([
            'status' => 'required|in:Pending,Delivered,In Transit',
        ]);

        $product->status = $request->status;
        $product->save();

        return back();
    }
    public function archive(Product $product)
    {
        $product->update([
            'archived' => true,
        ]);

        return redirect()->back();
    }
}