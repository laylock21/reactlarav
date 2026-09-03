<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    public function store(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:sub_categories,name,NULL,id,category_id,' . $category->id,
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $category->subCategories()->create($validated);

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        SubCategory $subCategory
    ) {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:sub_categories,name,' .
                    $subCategory->id .
                    ',id,category_id,' .
                    $subCategory->category_id,
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $subCategory->update($validated);

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();

        return back();
    }
}