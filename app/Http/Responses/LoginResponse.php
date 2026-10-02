<?php

namespace App\Http\Responses;

use Laravel\Fortify\Http\Responses\LoginResponse as FortifyLoginResponse;

class LoginResponse extends FortifyLoginResponse
{
    use TracksSessionId;

    public function toResponse($request)
    {
        $this->trackSessionId($request);

        return parent::toResponse($request);
    }
}
