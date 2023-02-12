<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends AbstractRepository
{
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    public function create(
        string $tgUserId,
        string $tonAddress
    ) {
        $user              = $this->getNew();
        $user->tg_user_id  = $tgUserId;
        $user->ton_address = $tonAddress;
        $user->save();

        return $user;
    }

    public function findByTgUserId(
        string $tgUserId,
        bool $isLock = true
    ) {
        $query = $this->model->where('tg_user_id', $tgUserId);

        if ($isLock) {
            return $query->lockForUpdate()->first();
        }

        return $query->first();
    }
}
