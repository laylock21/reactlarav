<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\StockThreshold;
use App\Models\Supplier;
use App\Models\Tag;
use App\Models\User;
use App\Observers\ActionLogObserver;
use App\Observers\AnalyticsEventObserver;
use App\Observers\OrderStatusObserver;
use App\Observers\StockThresholdObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureObservers();
    }

    /**
     * Register model observers. ActionLogObserver is only attached to
     * models whose table-style name exists in the action_logs.model_type
     * enum — analytics and notification models are excluded on purpose.
     * UserSetting is opted out: every theme/font-size/page-size toggle
     * would otherwise spam the audit trail with noise.
     */
    protected function configureObservers(): void
    {
        foreach ([User::class, Category::class, Supplier::class, Customer::class, Tag::class, Product::class, StockThreshold::class, Stock::class, StockMovement::class, Order::class, OrderItem::class] as $model) {
            $model::observe(ActionLogObserver::class);
        }

        Product::observe(StockThresholdObserver::class);
        Order::observe(OrderStatusObserver::class);

        Stock::observe(AnalyticsEventObserver::class);
        OrderItem::observe(AnalyticsEventObserver::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
