<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with(['customer:id,name', 'user:id,name'])
            ->withCount('orderItems')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($customer) => $customer->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest('ordered_at')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('orders', [
            'orders' => $orders,
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name']),
            'products' => Product::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'quantity', 'selling_price']),

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'customer_type' => ['required', Rule::in(['online', 'in store'])],
            'customer_reference' => ['nullable', 'string', 'max:255'],
            'platform' => ['required', Rule::in(['shopee', 'lazada', 'tiktok'])],
            'status' => ['nullable', Rule::in(['packed', 'out for delivery', 'delivered'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $items = $this->itemProductIds($validated);

        $products = Product::query()
            ->whereIn('id', array_column($items, 'product_id'))
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($request, $validated, $products, $items) {
            $order = Order::create([
                'order_number' => $this->nextOrderNumber(),
                'user_id' => $request->user()->getKey(),
                'customer_id' => $validated['customer_id'],
                'customer_type' => $validated['customer_type'],
                'customer_reference' => $validated['customer_reference'] ?? null,
                'platform' => $validated['platform'],
                'status' => $validated['status'] ?? 'packed',
                'total_amount' => 0,
                'notes' => $validated['notes'] ?? null,
                'ordered_at' => now(),
            ]);

            $total = 0;

            foreach ($items as $item) {
                // Validated exists:products,id, but re-check defensively
                // since the lookup can still miss under concurrency.
                $product = $products->get($item['product_id']);

                if ($product === null) {
                    continue;
                }

                $lineTotal = $item['quantity'] * (float) $product->selling_price;
                $total += $lineTotal;

                $order->orderItems()->create([
                    'product_id' => $product->getKey(),
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->selling_price,
                    'total_amount' => $lineTotal,
                ]);
            }

            $order->update(['total_amount' => $total]);
        });

        return back();
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(
            $order->load(['customer:id,name,email,phone,address', 'user:id,name', 'orderItems.product:id,name,sku'])
        );
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        // Line items are immutable once created; only the header fields
        // can change.
        $validated = $request->validate([
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'customer_type' => ['required', Rule::in(['online', 'in store'])],
            'customer_reference' => ['nullable', 'string', 'max:255'],
            'platform' => ['required', Rule::in(['shopee', 'lazada', 'tiktok'])],
            'status' => ['required', Rule::in(['packed', 'out for delivery', 'delivered'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $order->update($validated);

        return back();
    }

    public function destroy(Order $order): RedirectResponse
    {
        // Items cascade at the database level; stock levels are left
        // untouched (orders never mutate stock in this system).
        try {
            DB::transaction(function () use ($order) {
                $order->orderItems()->delete();
                $order->delete();
            });
        } catch (QueryException $e) {
            return back()->withErrors([
                'order' => "Cannot delete order \"{$order->order_number}\" because it is still referenced by other records.",
            ]);
        }

        return back();
    }

    private function nextOrderNumber(): string
    {
        do {
            $candidate = 'ORD-'.now()->format('Ymd').'-'.strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        } while (Order::query()->where('order_number', $candidate)->exists());

        return $candidate;
    }

    /**
     * Normalize validated line items into id/quantity pairs. Validation
     * already constrains the shape; this just gives the analyzer (and
     * downstream code) a concrete list type to work with.
     *
     * @param  array<string, mixed>  $validated
     * @return list<array{product_id: int, quantity: int}>
     */
    private function itemProductIds(array $validated): array
    {
        $items = $validated['items'] ?? [];

        if (! is_array($items)) {
            return [];
        }

        $normalized = [];

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $productId = $item['product_id'] ?? null;
            $quantity = $item['quantity'] ?? null;

            if (is_numeric($productId) && is_numeric($quantity)) {
                $normalized[] = [
                    'product_id' => (int) $productId,
                    'quantity' => max(1, (int) $quantity),
                ];
            }
        }

        return $normalized;
    }
}
