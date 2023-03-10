<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Task extends JsonResource
{
    public function toArray($request)
    {
        return [
            'taskId'      => $this->id,
            'taskName'    => $this->name,
            'description' => $this->description,
            'updateTime'  => $this->updated_at,
            'createTime'  => $this->created_at,
        ];
    }
}
