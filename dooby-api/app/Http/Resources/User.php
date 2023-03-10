<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    public function toArray($request)
    {
        return [
            'tgUserId'   => $this->tg_user_id,
            'tonAddress' => $this->ton_address,
            'updateTime' => $this->updated_at,
            'createTime' => $this->created_at,
        ];
    }
}
