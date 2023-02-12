<?php

namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{
    protected $userRepo;

    public function __construct(
        UserRepository $userRepo
    ) {
        $this->userRepo = $userRepo;
    }

    public function __call($function, $parameters)
    {
        if (method_exists($this->userRepo, $function)) {
            return $this->userRepo->{$function}(...$parameters);
        }

        throw new \Exception('call to undefined method');
    }
}
