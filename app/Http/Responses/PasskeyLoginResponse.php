<?php

namespace App\Http\Responses;

use Laravel\Passkeys\Http\Responses\PasskeyLoginResponse as BasePasskeyLoginResponse;

class PasskeyLoginResponse extends BasePasskeyLoginResponse
{
    use TracksSessionId;

    public function toResponse($request)
    {
        $this->trackSessionId($request);

        return parent::toResponse($request);
    }
}
