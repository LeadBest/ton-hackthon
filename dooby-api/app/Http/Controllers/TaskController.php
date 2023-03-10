<?php

namespace App\Http\Controllers;

use App\Http\Resources\Task;
use App\Http\Resources\TaskCollection;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $task;

    public function __construct(
        TaskService $task
    ) {
        $this->task = $task;
    }

    public function postCreateTask(Request $request)
    {
        $taskName    = $request->taskName;
        $description = $request->description;

        $task = $this->task->create(
            $taskName,
            $description,
        );

        return new Task($task);
    }

    public function getUserAllTasks(Request $request)
    {
        $tgUserId = $request->tgUserId;

        // get list
        $params['tgUserId'] = $tgUserId;

        $list = $this->task->getList($params);

        return new TaskCollection($list);
    }

    public function getClaimNft(Request $request)
    {
        $tgUserId = $request->tgUserId;

        $this->task->updateUserAllTasks($tgUserId);

        return response()->noContent();
    }
}
