<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductMovement;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\StockMovementService;
use App\Models\StockMovement;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()

            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('supplier', 'like', "%{$search}%");
                });
            })

            ->paginate(100)
            ->withQueryString();

        return Inertia::render('products', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }
    public function movements()
    {
        $movements = StockMovement::with(['product', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('stock-movement', [
            'movements' => $movements,
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

        $product = Product::create($validated);

        StockMovementService::record(
            product: $product,
            type: 'CREATED',
            quantity: $product->quantity,
            before: 0,
            after: $product->quantity,
            remarks: 'New product created.'
        );

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

        $before = $product->quantity;

        $product->fill($validated);
        $product->save();

        StockMovementService::record(
            product: $product,
            type: 'EDITED',
            quantity: 0,
            before: $before,
            after: $product->quantity,
            remarks: 'Product information updated.'
        );

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

    public function duplicate(Product $product)
    {
        $copy = $product->replicate();

        $copy->sku = $product->sku . '-COPY-' . now()->timestamp;

        $copy->barcode = null;

        $copy->save();

        ProductMovement::create([
            'product_id' => $copy->id,
            'user_id' => auth()->id(),
            'type' => 'DUPLICATED',
            'quantity' => 0,
            'before_quantity' => $product->quantity,
            'after_quantity' => $copy->quantity,
            'remarks' => 'Duplicated from SKU: ' . $product->sku,
        ]);

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