<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $categories = Category::query()
            ->parentCategories()
            ->with([
                'children' => fn ($query) => $query
                    ->withCount('products')
                    ->orderBy('name'),
            ])
            ->withCount(['children', 'products'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('children', fn ($child) => $child->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderBy('name')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('categories', [
            'categories' => $categories,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedCategory($request);

        Category::create($validated);

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $this->validatedCategory($request, $category);

        $category->update($validated);

        return back();
    }

    public function destroy(Category $category): RedirectResponse
    {
        $childrenCount = $category->children()->count();

        if ($childrenCount > 0) {
            return back()->withErrors([
                'category' => "Cannot delete \"{$category->name}\" because it has {$childrenCount} ".
                    Str::plural('subcategory', $childrenCount).
                    '. Move or delete the subcategories first.',
            ]);
        }

        $productsCount = $category->products()->count();

        if ($productsCount > 0) {
            return back()->withErrors([
                'category' => "Cannot delete \"{$category->name}\" because {$productsCount} ".
                    Str::plural('product', $productsCount).
                    ($productsCount === 1 ? ' is' : ' are').
                    ' assigned to it. Reassign the products before deleting the category.',
            ]);
        }

        // Database-level RESTRICT safety net: covers the race between
        // the checks above and the delete.
        return rescue(
            function () use ($category) {
                $category->delete();

                return back();
            },
            function () use ($category) {
                return back()->withErrors([
                    'category' => "Cannot delete \"{$category->name}\" because it is still referenced by other records.",
                ]);
            }
        );
    }

    /** @return array<string, mixed> */
    private function validatedCategory(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category)],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                Rule::notIn([$category?->id]),
                function ($attribute, $value, $fail) {
                    $parent = Category::find($value);

                    if ($parent instanceof Category && $parent->parent_id !== null) {
                        $fail('The parent category must be a top-level category.');
                    }
                },
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
