<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Stock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $stocks = Stock::query()
            ->with('product:id,name,sku')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('reference_number', 'like', "%{$search}%")
                        ->orWhereHas('product', fn ($product) => $product->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('stocks', [
            'stocks' => $stocks,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'type' => ['required', 'in:stock in,stock out,adjustment'],
            'quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:packed,out for delivery,delivered'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {
            Stock::create([
                ...$validated,
                'created_at' => now(),
            ]);
        });

        return back();
    }

    public function show(Stock $stock): JsonResponse
    {
        return response()->json($stock->load('product'));
    }

    public function update(Request $request, Stock $stock): RedirectResponse
    {
        // Ledger discipline: the product link never changes, only the
        // entry details can be corrected.
        $validated = $request->validate([
            'type' => ['required', 'in:stock in,stock out,adjustment'],
            'quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:packed,out for delivery,delivered'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $stock->update($validated);

        return back();
    }

    public function destroy(Stock $stock): RedirectResponse
    {
        $stock->delete();

        return back();
    }
}
