<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\AnalyticsEvent;
use App\Models\AnalyticsSnapshot;
use App\Models\Product;
use App\Models\StockMovement;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    use ResolvesPerPage;

    /**
     * @var list<string>
     */
    private const VIEWS = [
        'stock_movements',
        'stock_count',
        'total_sold',
        'revenue',
        'returns',
        'snapshots',
    ];

    public function index(Request $request): Response
    {
        [$view, $start, $end] = $this->validatedRange($request);

        return Inertia::render('analytics', [
            'view' => $view,
            'startDate' => $start->toDateString(),
            'endDate' => $end->toDateString(),
            'records' => $this->getViewData($view, $start, $end),
            'filters' => [
                'view' => $view,
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
            ],
        ]);
    }

    public function graphs(Request $request): Response
    {
        [$view, $start, $end] = $this->validatedRange($request);

        return Inertia::render('analytics-graphs', [
            'startDate' => $start->toDateString(),
            'endDate' => $end->toDateString(),
            'charts' => $this->getChartData($start, $end),
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
            ],
        ]);
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private function getChartData(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $orders = AnalyticsEvent::query()
            ->with('product:id,name,category_id')
            ->where('event_type', 'order')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $stockEvents = AnalyticsEvent::query()
            ->whereIn('event_type', ['stock in', 'stock adjustment'])
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $returns = AnalyticsEvent::query()
            ->where('event_type', 'return')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $snapshots = AnalyticsSnapshot::query()
            ->whereBetween('snapshot_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $categories = Product::query()
            ->with('category:id,name')
            ->whereIn('id', $orders->pluck('product_id')->unique()->all())
            ->get()
            ->keyBy('id');

        return [
            'stock_over_time' => array_values($snapshots
                ->groupBy(fn ($snapshot) => (string) $snapshot->snapshot_date)
                ->map(fn ($group, $date) => [
                    'date' => $date,
                    'stock' => $group->sum('stock_quantity'),
                ])
                ->sortKeys()
                ->all()),
            'top_products' => array_values($orders
                ->groupBy('product_id')
                ->map(function ($group) {
                    $first = $group->first();

                    return [
                        'name' => $first !== null ? $first->product->name : '—',
                        'quantity' => $group->sum('quantity'),
                    ];
                })
                ->sortByDesc('quantity')
                ->take(8)
                ->all()),
            'revenue_trend' => array_values($orders
                ->groupBy(fn ($event) => substr((string) $event->created_at, 0, 10))
                ->map(fn ($group, $date) => [
                    'date' => $date,
                    'revenue' => $group->sum('amount'),
                ])
                ->sortKeys()
                ->all()),
            'stock_in_out' => [
                ['name' => 'Stock In', 'quantity' => $stockEvents->where('event_type', 'stock in')->sum('quantity')],
                ['name' => 'Adjusted', 'quantity' => $stockEvents->where('event_type', 'stock adjustment')->sum('quantity')],
            ],
            'category_share' => array_values($orders
                ->groupBy(function ($event) use ($categories) {
                    $product = $categories->get($event->product_id);

                    return $product !== null && $product->category !== null ? $product->category->name : 'Uncategorized';
                })
                ->map(fn ($group, $category) => [
                    'name' => $category,
                    'value' => $group->sum('quantity'),
                ])
                ->sortByDesc('value')
                ->all()),
            'returns_trend' => array_values($returns
                ->groupBy(fn ($event) => substr((string) $event->created_at, 0, 10))
                ->map(fn ($group, $date) => [
                    'date' => $date,
                    'quantity' => $group->sum('quantity'),
                ])
                ->sortKeys()
                ->all()),
        ];
    }

    public function runSnapshots(): RedirectResponse
    {
        Artisan::call('analytics:snapshots');

        return back()->with('success', 'Snapshots generated successfully.');
    }

    public function export(Request $request): StreamedResponse
    {
        [$view, $start, $end] = $this->validatedRange($request);

        $rows = $this->getExportRows($view, $start, $end);
        $filename = "analytics-{$view}-{$start->toDateString()}-{$end->toDateString()}.csv";

        return response()->stream(function () use ($rows) {
            $file = fopen('php://output', 'w');

            if ($file === false) {
                throw new RuntimeException('Unable to open output stream.');
            }

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ]);
    }

    /**
     * @return array{0: string, 1: CarbonImmutable, 2: CarbonImmutable}
     */
    private function validatedRange(Request $request): array
    {
        $validated = $request->validate([
            'view' => ['nullable', 'string', 'in:'.implode(',', self::VIEWS)],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $end = isset($validated['end_date']) ? Date::parse($validated['end_date']) : Date::now();
        $start = isset($validated['start_date']) ? Date::parse($validated['start_date']) : $end->subDays(30);

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end, $start];
        }

        return [$validated['view'] ?? 'stock_movements', $start->startOfDay(), $end->endOfDay()];
    }

    private function getViewData(string $view, CarbonImmutable $start, CarbonImmutable $end): mixed
    {
        return match ($view) {
            'stock_count' => $this->getStockCount(),
            'total_sold' => $this->getTotalSold($start, $end),
            'revenue' => $this->getRevenue($start, $end),
            'returns' => $this->getReturns($start, $end),
            'snapshots' => $this->getSnapshots($start, $end),
            default => $this->getStockMovements($start, $end),
        };
    }

    /**
     * @return list<list<string>>
     */
    private function getExportRows(string $view, CarbonImmutable $start, CarbonImmutable $end): array
    {
        return match ($view) {
            'stock_count' => $this->stockCountRows(),
            'total_sold' => $this->soldRows($start, $end),
            'revenue' => $this->revenueRows($start, $end),
            'returns' => $this->returnsRows($start, $end),
            'snapshots' => $this->snapshotRows($start, $end),
            default => $this->movementRows($start, $end),
        };
    }

    private function getStockMovements(CarbonImmutable $start, CarbonImmutable $end): mixed
    {
        return StockMovement::query()
            ->with('product:id,name,sku')
            ->whereBetween('created_at', [$start, $end])
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();
    }

    private function getStockCount(): mixed
    {
        return Product::query()
            ->with('stockThreshold')
            ->where('is_active', true)
            ->orderBy('name')
            ->paginate($this->perPage(10))
            ->withQueryString();
    }

    private function getTotalSold(CarbonImmutable $start, CarbonImmutable $end): mixed
    {
        return AnalyticsEvent::query()
            ->with('product:id,name,sku')
            ->where('event_type', 'order')
            ->whereBetween('created_at', [$start, $end])
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function getRevenue(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $revenue = AnalyticsEvent::query()
            ->with('product:id,name,sku')
            ->where('event_type', 'order')
            ->whereBetween('created_at', [$start, $end])
            ->get()
            ->groupBy('product_id')
            ->map(fn ($events, $productId) => [
                'product_id' => $productId,
                'product' => $events->first()?->product,
                'orders_count' => $events->count(),
                'quantity' => $events->sum('quantity'),
                'total_revenue' => $events->sum('amount'),
            ])
            ->sortByDesc('total_revenue')
            ->values();

        return array_values($revenue->all());
    }

    private function getReturns(CarbonImmutable $start, CarbonImmutable $end): mixed
    {
        return AnalyticsEvent::query()
            ->with('product:id,name,sku')
            ->where('event_type', 'return')
            ->whereBetween('created_at', [$start, $end])
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();
    }

    private function getSnapshots(CarbonImmutable $start, CarbonImmutable $end): mixed
    {
        return AnalyticsSnapshot::query()
            ->with('product:id,name,sku')
            ->whereBetween('snapshot_date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('snapshot_date', 'desc')
            ->paginate($this->perPage(10))
            ->withQueryString();
    }

    /**
     * @return list<list<string>>
     */
    private function movementRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = [['Product', 'SKU', 'Type', 'Quantity', 'Before', 'After', 'Remarks', 'Date']];

        StockMovement::query()
            ->with('product:id,name,sku')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('id')
            ->chunk(500, function ($movements) use (&$rows) {
                foreach ($movements as $movement) {
                    $rows[] = [
                        $movement->product->name,
                        $movement->product->sku,
                        $movement->type,
                        (string) $movement->quantity,
                        (string) $movement->before_quantity,
                        (string) $movement->after_quantity,
                        $movement->remarks ?? '',
                        (string) $movement->created_at,
                    ];
                }
            });

        return $rows;
    }

    /**
     * @return list<list<string>>
     */
    private function stockCountRows(): array
    {
        $rows = [['Product', 'SKU', 'Quantity', 'Status', 'Min', 'Max']];

        Product::query()
            ->with('stockThreshold')
            ->where('is_active', true)
            ->orderBy('id')
            ->chunk(500, function ($products) use (&$rows) {
                foreach ($products as $product) {
                    $rows[] = [
                        $product->name,
                        $product->sku,
                        (string) $product->quantity,
                        $product->status,
                        (string) (optional($product->stockThreshold)->min_quantity ?? ''),
                        (string) (optional($product->stockThreshold)->max_quantity ?? ''),
                    ];
                }
            });

        return $rows;
    }

    /**
     * @return list<list<string>>
     */
    private function soldRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = [['Product', 'SKU', 'Quantity', 'Amount', 'Date']];

        AnalyticsEvent::query()
            ->with('product:id,name,sku')
            ->where('event_type', 'order')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('id')
            ->chunk(500, function ($events) use (&$rows) {
                foreach ($events as $event) {
                    $rows[] = [
                        $event->product->name,
                        $event->product->sku,
                        (string) $event->quantity,
                        (string) $event->amount,
                        (string) $event->created_at,
                    ];
                }
            });

        return $rows;
    }

    /**
     * @return list<list<string>>
     */
    private function revenueRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = [['Product', 'SKU', 'Orders', 'Quantity', 'Total Revenue']];

        foreach ($this->getRevenue($start, $end) as $row) {
            $rows[] = [
                $row['product']->name,
                $row['product']->sku,
                (string) $row['orders_count'],
                (string) $row['quantity'],
                (string) $row['total_revenue'],
            ];
        }

        return $rows;
    }

    /**
     * @return list<list<string>>
     */
    private function returnsRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = [['Product', 'SKU', 'Quantity', 'Date']];

        AnalyticsEvent::query()
            ->with('product:id,name,sku')
            ->where('event_type', 'return')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('id')
            ->chunk(500, function ($events) use (&$rows) {
                foreach ($events as $event) {
                    $rows[] = [
                        $event->product->name,
                        $event->product->sku,
                        (string) $event->quantity,
                        (string) $event->created_at,
                    ];
                }
            });

        return $rows;
    }

    /**
     * @return list<list<string>>
     */
    private function snapshotRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = [['Product', 'SKU', 'Date', 'Stock', 'Sold', 'Added', 'Removed', 'Revenue']];

        AnalyticsSnapshot::query()
            ->with('product:id,name,sku')
            ->whereBetween('snapshot_date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('snapshot_date', 'desc')
            ->chunk(500, function ($snapshots) use (&$rows) {
                foreach ($snapshots as $snapshot) {
                    $rows[] = [
                        $snapshot->product->name,
                        $snapshot->product->sku,
                        (string) $snapshot->snapshot_date,
                        (string) $snapshot->stock_quantity,
                        (string) $snapshot->total_sold,
                        (string) $snapshot->total_added,
                        (string) $snapshot->total_removed,
                        (string) $snapshot->total_revenue,
                    ];
                }
            });

        return $rows;
    }
}
