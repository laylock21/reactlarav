<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->with('parent:id,name')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('parent', fn ($parent) => $parent->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByRaw('parent_id is not null')
            ->orderBy('parent_id')
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
        if ($category->products()->exists()) {
            return back()->withErrors([
                'category' => 'Categories assigned to products cannot be deleted.',
            ]);
        }

        $category->delete();

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
