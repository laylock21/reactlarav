<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');

    Route::resource('products', ProductController::class);

    Route::get(
        '/products/{product}/movements',
        [ProductController::class, 'movements']
    )->name('products.movements');

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

});

require __DIR__.'/settings.php';