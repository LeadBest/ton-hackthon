<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

abstract class AbstractRepository
{
    /**
     * The model to execute queries on.
     *
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $model;

    /**
     * Create a new repository instance.
     *
     * @param \Illuminate\Database\Eloquent\Model $model The model to execute queries on
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get table name.
     *
     * @return string
     */
    public function getTable()
    {
        return $this->model->getTable();
    }

    /**
     * Get a new instance of the model.
     *
     * @param  array  $attributes
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getNew(array $attributes = [])
    {
        return $this->model->newInstance($attributes);
    }

    /**
     * 以 id 取得obj
     *
     * @param mixed $id object id
     *
     * @return object
     */
    public function findById($id, $isLock = false)
    {
        $query = $this->model->where('id', '=', $id);

        if ($isLock) {
            return $query->lockForUpdate()->first();
        }

        return $query->first();
    }

    /**
     * 以 id 確認是否存在
     *
     * @param mixed $id object id
     *
     * @return object
     */
    public function exists($id)
    {
        return $this->model->where('id', '=', $id)->exists();
    }

    /**
     * 以 id 取得obj 及 related objs
     *
     * @param mixed $id object id
     *
     * @return object
     */
    public function findByIdWith($id, $with, $isLock = false)
    {
        $query = $this->model->where('id', '=', $id)->with($with);

        if ($isLock) {
            return $query->lockForUpdate()->first();
        }

        return $query->first();
    }

    /**
     * 以 id 取得obj 及 related objs count
     *
     * @param mixed $id object id
     *
     * @return object
     */
    public function findByIdWithCount($id, $withCount, $isLock = false)
    {
        $query = $this->model->where('id', '=', $id)->withCount($withCount);

        if ($isLock) {
            return $query->lockForUpdate()->first();
        }

        return $query->first();
    }

    public function getSorting($sorting)
    {
        $order = 'asc';

        if (Str::startsWith($sorting, '-')) {
            $order   = 'desc';
            $sorting = Str::replaceFirst('-', '', $sorting);
        }

        $column = str_replace('-time', 'd_at', $sorting);
        $column = str_replace('-', '_', $column);

        return [
            'column' => $column,
            'order'  => $order,
        ];
    }

    public function getPagination($requests)
    {
        $pageSize = (int) Arr::get($requests, 'pageSize', 10);

        return [
            'page'     => (int) Arr::get($requests, 'page', 1),
            'pageSize' => ($pageSize < 100) ? $pageSize : 100,
        ];
    }
}
