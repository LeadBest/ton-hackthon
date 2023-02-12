<?php

namespace App\Repositories;

use App\Models\TaskUser;

class TaskUserRepository extends AbstractRepository
{
    public function __construct(TaskUser $taskUser)
    {
        parent::__construct($taskUser);
    }

    public function create(
        int $taskId,
        int $tgUserId,
        string $status = 'NEW'
    ) {
        $taskUser = TaskUser::updateOrCreate(
            [
                'task_id'    => $taskId,
                'tg_user_id' => $tgUserId,
            ],
            [
                'status' => $status,
            ]
        );

        return $taskUser;
    }

    public function findByTaskUser(
        string $taskId,
        string $tgUserId,
        bool $isLock = false
    ) {
        $query = $this->model->where([
            'task_id'    => $taskId,
            'tg_user_id' => $tgUserId,
        ]);

        if ($isLock) {
            return $query->lockForUpdate()->first();
        }

        return $query->first();
    }

    public function countUserCompleteTasks(string $tgUserId)
    {
        return $this->model
            ->where([
                'status'     => 'COMPLETE',
                'tg_user_id' => $tgUserId,
            ])
            ->count();
    }
}
