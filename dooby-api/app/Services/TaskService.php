<?php

namespace App\Services;

use App\Repositories\TaskRepository;
use App\Repositories\TaskUserRepository;
use App\Repositories\UserRepository;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\Request;

class TaskService
{
    public $taskUserRepo;

    protected $userRepo;
    protected $taskRepo;
    protected $tgService;

    public function __construct(
        UserRepository $userRepo,
        TaskRepository $taskRepo,
        TaskUserRepository $taskUserRepo,
        TelegramService $tgService
    ) {
        $this->userRepo     = $userRepo;
        $this->taskRepo     = $taskRepo;
        $this->taskUserRepo = $taskUserRepo;
        $this->tgService    = $tgService;
    }

    public function __call($function, $parameters)
    {
        if (method_exists($this->taskRepo, $function)) {
            return $this->taskRepo->{$function}(...$parameters);
        }

        throw new \Exception('call to undefined method');
    }

    public function updateUserAllTasks(
        int $tgUserId
    ) {
        // 1. check if user bound wallet
        $user = $this->userRepo->findByTgUserId($tgUserId);

        if ($user?->ton_address) {
            $taskId = $this->taskRepo->findByName('Connect Ton Wallet')->id;

            $this->taskUserRepo->create($taskId, $tgUserId, 'COMPLETE');
        }

        // 2. check if user reply message
        if ($this->tgService->checkMessageReply($tgUserId, '30', '-1001826368527')) {
            $taskId = $this->taskRepo->findByName('Reply Mission')->id;

            $this->taskUserRepo->create($taskId, $tgUserId, 'COMPLETE');
        }

        // 3. check if user react to message
        if ($this->tgService->checkMessageReaction($tgUserId, '28', '-1001826368527')) {
            $taskId = $this->taskRepo->findByName('Reaction Mission')->id;

            $this->taskUserRepo->create($taskId, $tgUserId, 'COMPLETE');
        }

        // // check if user joined group
        // $response = $this->tgService->getChatMember($tgUserId);
        // $joinStatus = $response['result']['status'] ?? 'invalid';

        // if ($joinStatus == 'member') {
        //     $taskId = $this->taskRepo->findByName('Join Tobby Group')->id;

        //     $this->taskUserRepo->create($taskId, $tgUserId, 'COMPLETE');
        // }

        // check if completed all tasks
        $count = $this->taskUserRepo->countUserCompleteTasks($tgUserId);

        if ($count >= 3) {
            $this->completeAllTasks($tgUserId, '');
        } else {
            $message  = "Oops\! Looks like you haven't completed all the tasks yet\. Please complete them all to receive your NFT reward\.";

            $this->tgService->sendMessage($tgUserId, $message);
        }

        return true;
    }

    public function completeAllTasks(
        string $tgUserId,
        string $tonAddress
    ) {
        // TODO: mint nft
        $nftAddress = $this->mintNft($tonAddress);

        // announce to user
        $link = "https://testnet.tonscan.org/nft/{$nftAddress}";

        $message  = "\xF0\x9F\x94\x8A Wow\! All Missions are completed\! Reward has sent to your wallet\. \xF0\x9F\x8F\x86 \n\nPlease check at [here]({$link})";
        $this->tgService->sendMessage($tgUserId, $message);

        return true;
    }

    private function mintNft(string $tonAddress)
    {
        // mock result
        return 'EQDGAoDJhk1gz_Msos8MGbAvfuQ7DNrfefqZsKaQPb6fbn-O';

        $params = [
            'tonAddress' => $tonAddress,
        ];

        $url = "cloud_function";

        $request = new Request('POST', $url);
        $request = $request->withHeader('Content-Type', 'application/json');
        $request = $request->withBody(Utils::streamFor(json_encode($params)));

        $response   = $this->sendHttpRequest($request);
        $nftAddress = $response['result'];

        return $nftAddress;
    }

    private static function sendHttpRequest($request)
    {
        $client = new Client();

        try {
            $response = $client->send($request);
        } catch (ClientException $e) {
            return [];
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }

        return json_decode($response->getBody(), true);
    }
}
