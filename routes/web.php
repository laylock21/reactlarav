<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActionLogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
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
        Route::get('/create', [ProductController::class, 'create'])->name('create'); //Is this thing used???
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


    });

    Route::prefix('archived')->name('archived.')->group(function () {
        // Archived products
        Route::get('/', [ProductController::class, 'archived'])->name('archived');
        Route::patch('/{product}/restore', [ProductController::class, 'restore'])->name('restore');
        Route::patch('/restore-bulk', [ProductController::class, 'restoreBulk'])->name('restore-bulk');
    });

    // Stocks (child of Products)
    Route::prefix('stocks')->name('stocks.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::post('/', [StockController::class, 'store'])->name('store');
        Route::get('/{stock}', [StockController::class, 'show'])->name('show');
        Route::put('/{stock}', [StockController::class, 'update'])->name('update');
        Route::delete('/{stock}', [StockController::class, 'destroy'])->name('destroy');
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

    });

    // ===========================================
    // Users
    // ===========================================
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Suppliers
    // ===========================================
    Route::prefix('suppliers')->name('suppliers.')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('index');
        Route::post('/', [SupplierController::class, 'store'])->name('store');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('update');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Customers (shell: list only)
    // ===========================================
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('index');
        Route::post('/', [CustomerController::class, 'store'])->name('store');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Orders (shell: list only)
    // ===========================================
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::put('/{order}', [OrderController::class, 'update'])->name('update');
        Route::delete('/{order}', [OrderController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Notifications (inbox for observer alerts)
    // ===========================================
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::patch('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Action Logs (read-only audit trail)
    // ===========================================
    Route::prefix('action-logs')->name('action-logs.')->group(function () {
        Route::get('/', [ActionLogController::class, 'index'])->name('index');
    });

    // ===========================================
    // Tags
    // ===========================================
    Route::prefix('tags')->name('tags.')->group(function () {
        Route::get('/', [TagController::class, 'index'])->name('index');
        Route::post('/', [TagController::class, 'store'])->name('store');
        Route::put('/{tag}', [TagController::class, 'update'])->name('update');
        Route::delete('/{tag}', [TagController::class, 'destroy'])->name('destroy');
    });

    // ===========================================
    // Analytics (with child: Analytics Export)
    // ===========================================
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [AnalyticsController::class, 'index'])->name('index');
        Route::get('/graphs', [AnalyticsController::class, 'graphs'])->name('graphs');
        Route::get('/export', [AnalyticsController::class, 'export'])->name('export');
        Route::post('/snapshots', [AnalyticsController::class, 'runSnapshots'])->name('snapshots');
    });

});

require __DIR__.'/settings.php';
