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
        $taskName         = $request->taskName;
        $taskType         = $request->taskType;
        $description      = $request->description;
        $keyword          = $request->keyword;
        $expiredTimestamp = $request->expiredTimestamp;

        $task = $this->task->create(
            $taskType,
            $taskName,
            $description,
            $expiredTimestamp,
            $keyword,
        );

        return new Task($task);
    }

    public function getUserAllTasks(Request $request)
    {
        $tgUserId = $request->tgUserId;

        $this->task->updateUserAllTasks($tgUserId);

        // get list
        $params['tgUserId'] = $tgUserId;

        $list = $this->task->getList($params);

        return new TaskCollection($list);
    }

    public function getCheckUserReply(Request $request)
    {
        $tgUserId = $request->tgUserId;

        $this->task->updateUserReplyTask($tgUserId);

        return response()->noContent();
    }
}
