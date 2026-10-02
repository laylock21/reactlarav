<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $suppliers = Supplier::query()
            ->withCount('products')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('contact_person', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('suppliers', [
            'suppliers' => $suppliers,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedSupplier($request);

        Supplier::create($validated);

        return back();
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $validated = $this->validatedSupplier($request, $supplier);

        $supplier->update($validated);

        return back();
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $productsCount = $supplier->products()->count();

        if ($productsCount > 0) {
            return back()->withErrors([
                'supplier' => "Cannot delete \"{$supplier->name}\" because {$productsCount} ".
                    Str::plural('product', $productsCount).
                    ($productsCount === 1 ? ' is' : ' are').
                    ' assigned to it. Reassign the products before deleting the supplier.',
            ]);
        }

        // Database-level RESTRICT safety net: covers the race between
        // the check above and the delete.
        return rescue(
            function () use ($supplier) {
                $supplier->delete();

                return back();
            },
            function () use ($supplier) {
                return back()->withErrors([
                    'supplier' => "Cannot delete \"{$supplier->name}\" because it is still referenced by other records.",
                ]);
            }
        );
    }

    /** @return array<string, mixed> */
    private function validatedSupplier(Request $request, ?Supplier $supplier = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('suppliers', 'name')->ignore($supplier)],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
