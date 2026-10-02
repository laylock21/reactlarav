<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActionLogController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $logs = ActionLog::query()
            ->with('user:id,name')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query->where('description', 'like', "%{$search}%")
                        ->orWhere('action', 'like', "%{$search}%")
                        ->orWhere('model_type', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($user) => $user->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->filled('model_type'), fn ($query) => $query->where('model_type', $request->string('model_type')))
            ->when($request->filled('action'), fn ($query) => $query->where('action', $request->string('action')))
            ->when($request->filled('start_date'), fn ($query) => $query->where('created_at', '>=', $request->string('start_date')))
            ->when($request->filled('end_date'), fn ($query) => $query->where('created_at', '<=', $request->string('end_date')))
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('action-logs', [
            'logs' => $logs,

            'filters' => [
                'search' => $request->search,
                'model_type' => $request->input('model_type'),
                'action' => $request->input('action'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
            ],
        ]);
    }
}
