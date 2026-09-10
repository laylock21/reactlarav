<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\StockMovementService;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->where('is_active', true) // Only show active products
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
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
    public function movements(Request $request, Product $product = null)
    {
        $query = StockMovement::with(['product', 'user'])
            ->latest();

        if ($product) {
            $query->where('product_id', $product->id);
        }

        if ($request->filled('search')) {

            $search = $request->search;

            $query->whereHas('product', function ($q) use ($search) {

                $q->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%");

            });
        }

        return Inertia::render('stock-movement', [
            'movements' => $query
                ->paginate(50)
                ->withQueryString(),

            'filters' => [
                'search' => $request->search,
            ],

            'product' => $product,
        ]);
    }

    public function revertMovements(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:stock_movements,id',
        ]);

        $movements = StockMovement::with([
            'product',
            'user',
        ])
            ->latest()
            ->get()
            ->withQueryString();

        foreach ($movements as $movement) {
            if ($movement->type !== 'EDITED' || ! $movement->before_data) {
                continue;
            }

            $product = $movement->product;
            if (! $product) {
                continue;
            }

            $currentState = $product->toArray();
            $beforeData = array_intersect_key(
                $movement->before_data,
                array_flip($product->getFillable())
            );

            $product->fill($beforeData);
            $product->save();

            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'type' => 'EDITED',
                'quantity' => 0,
                'before_quantity' => $currentState['quantity'] ?? 0,
                'after_quantity' => $product->quantity,
                'before_data' => $currentState,
                'after_data' => $product->fresh()->toArray(),
                'remarks' => 'Reverted edited stock movement #' . $movement->id,
            ]);
        }

        return back();
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

        $beforeQuantity = $product->quantity;

        // Save the product before editing
        $beforeData = $product->toArray();

        $product->fill($validated);
        $product->save();

        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'type' => 'EDITED',
            'quantity' => 0,
            'before_quantity' => $beforeQuantity,
            'after_quantity' => $product->quantity,
            'before_data' => $beforeData,
            'after_data' => $product->fresh()->toArray(),
            'remarks' => 'Product information updated.',
        ]);

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
        // Store the original quantity before creating the copy
        $originalQuantity = (int) $product->quantity;

        // Create the duplicated product
        $copy = $product->replicate();

        $copy->sku = $product->sku . '-COPY-' . now()->timestamp;
        $copy->barcode = null;

        $copy->save();

        // Record the duplication in the stock movement ledger
        StockMovement::create([
            'product_id' => $copy->id,
            'user_id' => auth()->id(),
            'type' => 'DUPLICATED',

            // The duplicated product starts with the same stock
            'quantity' => $originalQuantity,

            // Original product's stock
            'before_quantity' => $originalQuantity,

            // Duplicated product's starting stock
            'after_quantity' => (int) $copy->quantity,

            'before_data' => $product->toArray(),
            'after_data' => $copy->toArray(),

            'remarks' => 'Duplicated from SKU: ' . $product->sku,
        ]);

        return redirect()->back();
    }

    public function archived(Request $request)
    {
        $products = Product::query()
            ->where('is_active', false) // Using is_active instead of archived
            ->when(
                $request->search,
                function ($query, $search) {
                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhere('barcode', 'like', "%{$search}%");
                    });
                }
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('archived', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function restore(Product $product)
    {
        $product->update([
            'is_active' => true, // Using is_active instead of archived
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

    public function adjustStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type' => 'required|in:increase,decrease',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $before = $product->quantity;

        if ($validated['type'] === 'increase') {

            $after = $before + $validated['quantity'];

        } else {

            $after = max(0, $before - $validated['quantity']);

        }

        $product->update([
            'quantity' => $after,
        ]);

        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),

            'type' => 'STOCK_ADJUSTMENT',

            'quantity' => $validated['quantity'],

            'before_quantity' => $before,

            'after_quantity' => $after,

            'remarks' =>
                $validated['reason'] .
                ($validated['remarks']
                    ? ' - ' . $validated['remarks']
                    : ''),

            'before_data' => [
                'quantity' => $before,
            ],

            'after_data' => [
                'quantity' => $after,
            ],
        ]);

        return back();
    }

    public function archive(Product $product)
    {
        $beforeData = $product->toArray();

        $product->update([
            'is_active' => false, // Using is_active instead of archived
        ]);

        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'type' => 'ARCHIVED',
            'quantity' => 0,
            'before_quantity' => $product->quantity,
            'after_quantity' => $product->quantity,
            'before_data' => $beforeData,
            'after_data' => $product->fresh()->toArray(),
            'remarks' => 'Product archived.',
        ]);

        return to_route('products.index');
    }

    public function restoreBulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:products,id',
        ]);

        Product::whereIn('id', $validated['ids'])
            ->where('is_active', false) // Using is_active instead of archived
            ->update([
                'is_active' => true, // Using is_active instead of archived
            ]);

        return back();
    }
}