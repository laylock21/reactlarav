<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $users = User::query()
            ->withCount(['orders', 'actionLogs'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('users', [
            'users' => $users,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedUser($request);
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return back();
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $this->validatedUser($request, $user);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->orders()->exists()) {
            return back()->withErrors([
                'user' => "Cannot delete \"{$user->name}\" because orders are still assigned to it.",
            ]);
        }

        if (auth()->id() === $user->getKey()) {
            return back()->withErrors([
                'user' => 'You cannot delete your own account from here.',
            ]);
        }

        DB::table('sessions')->where('user_id', $user->getKey())->delete();
        DB::table('action_logs')->where('user_id', $user->getKey())->delete();

        return rescue(
            function () use ($user) {
                $user->delete();

                return back();
            },
            function () use ($user) {
                return back()->withErrors([
                    'user' => "Cannot delete \"{$user->name}\" because it is still referenced by other records.",
                ]);
            }
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedUser(Request $request, ?User $user = null): array
    {
        $passwordRule = $user === null
            ? ['required', 'string', 'min:8', 'confirmed']
            : ['nullable', 'string', 'min:8', 'confirmed'];

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => $passwordRule,
            'role' => ['required', Rule::in(['admin', 'manager', 'staff'])],
            'is_active' => ['required', 'boolean'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
