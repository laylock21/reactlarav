<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $customers = Customer::query()
            ->withCount('orders')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('customers', [
            'customers' => $customers,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedCustomer($request);

        Customer::create($validated);

        return back();
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $this->validatedCustomer($request, $customer);

        $customer->update($validated);

        return back();
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $ordersCount = $customer->orders()->count();

        if ($ordersCount > 0) {
            return back()->withErrors([
                'customer' => "Cannot delete \"{$customer->name}\" because {$ordersCount} ".
                    Str::plural('order', $ordersCount).
                    ($ordersCount === 1 ? ' is' : ' are').
                    ' assigned to it. Reassign or delete the orders before deleting the customer.',
            ]);
        }

        // Database-level RESTRICT safety net: covers the race between
        // the check above and the delete.
        return rescue(
            function () use ($customer) {
                $customer->delete();

                return back();
            },
            function () use ($customer) {
                return back()->withErrors([
                    'customer' => "Cannot delete \"{$customer->name}\" because it is still referenced by other records.",
                ]);
            }
        );
    }

    /** @return array<string, mixed> */
    private function validatedCustomer(Request $request, ?Customer $customer = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customer)],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:1000'],
        ]);
    }
}
