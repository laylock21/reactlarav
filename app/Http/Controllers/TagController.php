<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    public function store(Request $request, SubCategory $subCategory)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:tags,name,NULL,id,sub_category_id,' . $subCategory->id,
            ],
        ]);

        $subCategory->tags()->create($validated);

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Tag $tag
    ) {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:tags,name,' .
                    $tag->id .
                    ',id,sub_category_id,' .
                    $tag->sub_category_id,
            ],
        ]);

        $tag->update($validated);

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return back();
    }
}