<?php

namespace App\Repositories;

use App\Models\UserClaim;

class UserClaimRepository extends AbstractRepository
{
    public function __construct(UserClaim $claim)
    {
        parent::__construct($claim);
    }

    public function create(
        int $userId,
        int $tokenId,
        string $tokenAddress
    ) {
        $claim                = $this->getNew();
        $claim->user_id       = $userId;
        $claim->token_id      = $tokenId;
        $claim->token_address = $tokenAddress;
        $claim->save();

        return $claim;
    }

    public function findByUserId(
        int $userId
    ) {
        return $this->model
            ->where('user_id', $userId)
            ->first();
    }
}
