<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
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
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('categories', [
            'categories' => $categories,

            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedCategory($request);

        Category::create($validated);

        return back();
    }

    public function update(Request $request, Category $category)
    {
        $validated = $this->validatedCategory($request, $category);

        $category->update($validated);

        return back();
    }

    public function destroy(Category $category)
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

        try {
            $category->delete();
        } catch (QueryException $e) {
            // Database-level RESTRICT safety net: covers the race between
            // the checks above and the delete.
            return back()->withErrors([
                'category' => "Cannot delete \"{$category->name}\" because it is still referenced by other records.",
            ]);
        }

        return back();
    }

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
                    if (Category::find($value)?->parent_id !== null) {
                        $fail('The parent category must be a top-level category.');
                    }
                },
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
