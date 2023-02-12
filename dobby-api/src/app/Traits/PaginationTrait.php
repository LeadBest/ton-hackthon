<?php

namespace App\Traits;

trait PaginationTrait
{
    /**
     * 取得分頁資訊
     *
     * @param object $resource
     * @return array
     */
    public function getPagination($resource)
    {
        return [
            'totalRows'   => $resource->total(),
            'totalPages'  => $resource->lastPage(),
            'pageSize'    => $resource->perPage(),
            'currentPage' => $resource->currentPage(),
        ];
    }
}
