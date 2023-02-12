<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class TaskRepository extends AbstractRepository
{
    public function __construct(Task $task)
    {
        parent::__construct($task);
    }

    public function create(
        string $taskType,
        string $taskName,
        string $description,
        int $expiredTime,
        string $keyword = null
    ) {
        $task              = $this->getNew();
        $task->type        = $taskType;
        $task->name        = $taskName;
        $task->description = $description;
        $task->keyword     = $keyword;
        $task->expired_at  = $expiredTime;
        $task->save();

        return $task;
    }

    public function findByName(string $name)
    {
        return $this->model
            ->where([
                'name' => $name,
            ])
            ->first();
    }

    public function getList(array $data)
    {
        $taskUsers = DB::table('task_users')
            ->select('*')
            ->where('tg_user_id', $data['tgUserId']);

        $query = $this->model::from('tasks as t')
            ->leftJoinSub($taskUsers, 'tu', function ($join) {
                $join->on('t.id', '=', 'tu.task_id');
            })
            ->select('t.*', 'tu.status');

        $query = $query->orderBy('id', 'asc');

        // pagination
        $pagination = $this->getPagination($data);

        return $query->paginate($pagination['pageSize']);
    }
}
