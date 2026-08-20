<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    

    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');

    Route::resource('products', ProductController::class);

    Route::get('/products/export/csv', [ProductController::class, 'exportCsv'])
        ->name('products.export.csv');

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
});

require __DIR__.'/settings.php';