<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class TaskRepository extends AbstractRepository
{
    public function __construct(Task $task)
    {
        parent::__construct($task);
    }

    public function create(
        string $taskName,
        string $description
    ) {
        $task              = $this->getNew();
        $task->name        = $taskName;
        $task->description = $description;
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
