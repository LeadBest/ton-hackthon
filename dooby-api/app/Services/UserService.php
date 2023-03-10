<?php

namespace App\Services;

use App\Repositories\UserClaimRepository;
use App\Repositories\UserRepository;

class UserService
{
    protected $userRepo;
    protected $claimRepo;

    public function __construct(
        UserRepository $userRepo,
        UserClaimRepository $claimRepo
    ) {
        $this->userRepo  = $userRepo;
        $this->claimRepo = $claimRepo;
    }

    public function __call($function, $parameters)
    {
        if (method_exists($this->userRepo, $function)) {
            return $this->userRepo->{$function}(...$parameters);
        }

        throw new \Exception('call to undefined method');
    }

    public function getClaimRecord(int $userId)
    {
        $url = '';

        if ($claim = $this->claimRepo->findByUserId($userId)) {
            $tokenAddress = $claim->token_address;
            $url          = "https://testnet.tonscan.org/nft/{$tokenAddress}";
        }

        return $url;
    }
}
