<?php

namespace App\Http\Controllers;

use App\Concerns\ResolvesPerPage;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    use ResolvesPerPage;

    public function index(Request $request): Response
    {
        $notifications = Notification::query()
            ->when($request->filled('unread') && $request->boolean('unread'), fn ($query) => $query->where('is_read', false))
            ->latest('id')
            ->paginate($this->perPage(10))
            ->withQueryString();

        return Inertia::render('notifications', [
            'notifications' => $notifications,
            'unreadCount' => Notification::query()->where('is_read', false)->count(),

            'filters' => [
                'unread' => $request->boolean('unread'),
            ],
        ]);
    }

    public function markAsRead(Notification $notification): RedirectResponse
    {
        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        Notification::query()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return back();
    }

    public function destroy(Notification $notification): RedirectResponse
    {
        $notification->delete();

        return back();
    }
}
