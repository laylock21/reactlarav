<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\AnalyticsController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // ===========================================
    // Dashboard
    // ===========================================
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // ===========================================
    // Products (with children: Stocks, Stock Movement, Archived)
    // ===========================================
    Route::prefix('products')->name('products.')->group(function () {
        // Main products routes
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::put('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');

        // Product actions
        Route::post('/{product}/duplicate', [ProductController::class, 'duplicate'])->name('duplicate');
        Route::patch('/{product}/status', [ProductController::class, 'status'])->name('status');
        Route::patch('/{product}/archive', [ProductController::class, 'archive'])->name('archive');
        Route::patch('/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('adjust-stock');

        // Product exports
        Route::get('/export/csv', [ProductController::class, 'exportCsv'])->name('export.csv');
        Route::get('/export/pdf', [ProductController::class, 'exportPdf'])->name('export.pdf');

        // Product movements
        Route::get('/{product}/movements', [ProductController::class, 'movements'])->name('movements');

        // Archived products
        Route::get('/archived', [ProductController::class, 'archived'])->name('archived');
        Route::patch('/{product}/restore', [ProductController::class, 'restore'])->name('restore');
        Route::patch('/restore-bulk', [ProductController::class, 'restoreBulk'])->name('restore-bulk');
    });

    // Stocks (child of Products)
    Route::prefix('stocks')->name('stocks.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::post('/', [StockController::class, 'store'])->name('store');
        Route::get('/{stock}', [StockController::class, 'show'])->name('show');
    });

    // Stock Movement (child of Products)
    Route::prefix('stock-movement')->name('stock-movement.')->group(function () {
        Route::get('/', [ProductController::class, 'movements'])->name('index');
        Route::patch('/revert', [ProductController::class, 'revertMovements'])->name('revert');
    });

    // ===========================================
    // Categories
    // ===========================================
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');

        // Sub-categories
        Route::post('/{category}/sub-categories', [SubCategoryController::class, 'store'])->name('sub-categories.store');
    });

    // Sub-categories (separate resource)
    Route::prefix('sub-categories')->name('sub-categories.')->group(function () {
        Route::put('/{subCategory}', [SubCategoryController::class, 'update'])->name('update');
        Route::delete('/{subCategory}', [SubCategoryController::class, 'destroy'])->name('destroy');

        // Tags under sub-categories
        Route::post('/{subCategory}/tags', [TagController::class, 'store'])->name('tags.store');
    });

    // Tags
    Route::prefix('tags')->name('tags.')->group(function () {
        Route::put('/{tag}', [TagController::class, 'update'])->name('update');
        Route::delete('/{tag}', [TagController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Users
    // ===========================================
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', function () {
            return inertia('users/index');
        })->name('index');
    });

    // ===========================================
    // Suppliers
    // ===========================================
    Route::prefix('suppliers')->name('suppliers.')->group(function () {
        Route::get('/', function () {
            return inertia('suppliers/index');
        })->name('index');
    });

    // ===========================================
    // Analytics (with child: Analytics Export)
    // ===========================================
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [AnalyticsController::class, 'index'])->name('index');
        Route::get('/export', [AnalyticsController::class, 'export'])->name('export');
    });

});

require __DIR__.'/settings.php';
