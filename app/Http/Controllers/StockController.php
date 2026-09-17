<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function index()
    {
        abort(404);
    }

    public function store(Request $request)
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

    public function show(Stock $stock)
    {
        return response()->json($stock->load('product'));
    }
}
