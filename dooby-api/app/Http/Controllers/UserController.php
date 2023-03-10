<?php

namespace App\Http\Controllers;

use App\Http\Resources\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends Controller
{
    protected $user;

    public function __construct(
        UserService $user
    ) {
        $this->user = $user;
    }

    public function postCreate(Request $request)
    {
        $tgUserId   = $request->tgUserId;
        $tonAddress = $request->tonAddress;

        if (!$user = $this->user->findByTgUserId($tgUserId)) {
            $user = $this->user->create($tgUserId, $tonAddress);
        }

        return new User($user);
    }

    public function getUser(Request $request)
    {
        $tgUserId = $request->tgUserId;

        $user = $this->user->findByTgUserId($tgUserId);

        if (!$user) {
            throw new NotFoundHttpException();
        }

        return new User($user);
    }
}
