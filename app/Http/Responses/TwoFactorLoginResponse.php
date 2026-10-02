<?php

namespace App\Http\Responses;

use Laravel\Fortify\Http\Responses\TwoFactorLoginResponse as FortifyTwoFactorLoginResponse;

class TwoFactorLoginResponse extends FortifyTwoFactorLoginResponse
{
    use TracksSessionId;

    public function toResponse($request)
    {
        $this->trackSessionId($request);

        return parent::toResponse($request);
    }
}
