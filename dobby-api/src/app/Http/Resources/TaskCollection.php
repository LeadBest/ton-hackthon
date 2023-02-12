<?php

namespace App\Http\Resources;

use App\Traits\PaginationTrait;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TaskCollection extends ResourceCollection
{
    use PaginationTrait;

    private $pagination;

    public function __construct($resource)
    {
        $this->pagination = $this->getPagination($resource);

        $resource = $resource->getCollection();

        parent::__construct($resource);
    }

    public function toArray($request)
    {
        return array_merge($this->pagination, [
            'data' => $this->collection->map(function ($item) {
                return [
                    'taskId'      => $item->id,
                    'taskName'    => $item->name,
                    'description' => $item->description,
                    'status'      => $item->status ?? 'PENDING',
                    'expiredTime' => $item->expired_at,
                    'updateTime'  => $item->updated_at,
                    'createTime'  => $item->created_at,
                ];
            }),
        ]);
    }
}
