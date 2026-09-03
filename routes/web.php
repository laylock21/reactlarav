<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\TagController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')    
        ->name('dashboard');

    Route::get('/products/archived', [ProductController::class, 'archived'])
        ->name('products.archived');

    Route::resource('products', ProductController::class);

    Route::get('/products/export/csv', [ProductController::class, 'exportCsv'])
        ->name('products.export.csv');

    Route::resource('categories', CategoryController::class)
        ->only([
            'index',
            'store',
            'update',
            'destroy',
        ]);

    Route::post(
        '/categories/{category}/sub-categories',
        [CategoryController::class, 'storeSubCategory']
    )->name('categories.sub-categories.store');

    Route::post(
        '/sub-categories/{subCategory}/tags',
        [CategoryController::class, 'storeTag']
    )->name('sub-categories.tags.store');

    Route::post(
        '/categories/{category}/sub-categories',
        [SubCategoryController::class, 'store']
    )->name('sub-categories.store');

    Route::put(
        '/sub-categories/{subCategory}',
        [SubCategoryController::class, 'update']
    )->name('sub-categories.update');

    Route::delete(
        '/sub-categories/{subCategory}',
        [SubCategoryController::class, 'destroy']
    )->name('sub-categories.destroy');


    Route::post(
        '/sub-categories/{subCategory}/tags',
        [TagController::class, 'store']
    )->name('tags.store');

    Route::post(
        '/sub-categories/{subCategory}/tags',
        [TagController::class, 'store']
    )->name('sub-categories.tags.store');

    Route::delete(
        '/tags/{tag}',
        [TagController::class, 'destroy']
    )->name('tags.destroy');

    Route::put(
        '/tags/{tag}',
        [TagController::class, 'update']
    )->name('tags.update');

    Route::delete(
        '/tags/{tag}',
        [TagController::class, 'destroy']
    )->name('tags.destroy');

    Route::get('/products/export/pdf', [ProductController::class, 'exportPdf'])
        ->name('products.export.pdf');

    Route::get(
        '/products/{product}/movements',
        [ProductController::class, 'movements']
    )->name('products.movements');
    
    Route::get('/stock-movement', [ProductController::class, 'movements'])
        ->name('stock-movement');

    Route::patch('/stock-movement/revert', [ProductController::class, 'revertMovements'])
        ->name('stock-movement.revert');

    Route::post(
        '/products/{product}/duplicate',
        [ProductController::class, 'duplicate']
    )->name('products.duplicate');

    Route::patch(
        '/products/{product}/status',
        [ProductController::class, 'status']
    )->name('products.status');

    Route::patch(
        '/products/{product}/archive',
        [ProductController::class, 'archive'
    ])->name('products.archive');

    Route::patch(
        '/products/{product}/adjust-stock',
        [ProductController::class, 'adjustStock']
    )->name('products.adjust-stock');

    Route::get('/products', [ProductController::class, 'index'])
    ->name('products.index');

    Route::get('/products/archived', [ProductController::class, 'archived'])
        ->name('products.archived');

    Route::patch('/products/{product}/restore', [ProductController::class, 'restore'])
        ->name('products.restore');

    Route::patch('/products/restore-bulk', [ProductController::class, 'restoreBulk'])
    ->name('products.restore-bulk');

});

require __DIR__.'/settings.php';