<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;

trait TracksSessionId
{
    /**
     * Record the post-regeneration session id. Every login flow
     * regenerates the session BEFORE resolving its response, so by the
     * time a login response runs, session()->getId() is final. Storing
     * it here (instead of on the Login event) avoids locking the user
     * out with a stale pre-regeneration id.
     */
    protected function trackSessionId(Request $request): void
    {
        $user = $request->user();

        if ($user !== null) {
            $user->forceFill(['current_session_id' => $request->session()->getId()])->save();
        }
    }
}
