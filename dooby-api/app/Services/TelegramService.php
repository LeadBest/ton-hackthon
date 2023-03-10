<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\MultipartStream;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Utils;

class TelegramService
{
    protected $botToken;
    protected $groupChatId;

    public function __construct()
    {
        $this->botToken    = config('app.telegram_bot_token');
        $this->groupChatId = config('app.telegram_dobby_room');
    }

    public function getChatMember(string $userId)
    {
        $url      = "https://api.telegram.org/bot{$this->botToken}/getChatMember?chat_id={$this->groupChatId}&user_id={$userId}";

        $request = new Request('GET', $url);

        return $this->sendHttpRequest($request);
    }

    public function checkMessageReply(
        string $userId,
        string $messageId,
        string $peerId
    ) {
        $params = [
            'user'   => $userId,
            'msgID'  => $messageId,
            'peerId' => $peerId,
        ];

        $url = "https://us-central1-boxwood-pillar-368209.cloudfunctions.net/function-reply";

        $request = new Request('POST', $url);
        $request = $request->withHeader('Content-Type', 'application/json');
        $request = $request->withBody(Utils::streamFor(json_encode($params)));

        $response = $this->sendHttpRequest($request, false, false);

        if ($response && $response->getStatusCode() == 200) {
            return true;
        }

        return false;
    }

    public function checkMessageReaction(
        string $userId,
        string $messageId,
        string $peerId
    ) {
        $params = [
            'user'   => $userId,
            'msgID'  => $messageId,
            'peerId' => $peerId,
        ];

        $url = "https://us-central1-boxwood-pillar-368209.cloudfunctions.net/function-reaction";

        $request = new Request('POST', $url);
        $request = $request->withHeader('Content-Type', 'application/json');
        $request = $request->withBody(Utils::streamFor(json_encode($params)));

        $response = $this->sendHttpRequest($request, false, false);

        if ($response && $response->getStatusCode() == 200) {
            return true;
        }

        return false;
    }

    public function sendMessage(
        string $userId,
        string $message
    ) {
        $multipart = new MultipartStream([
            [
                'name'     => 'chat_id',
                'contents' => $userId,
            ],
            [
                'name'     => 'text',
                'contents' => $message,
            ],
            [
                'name'     => 'parse_mode',
                'contents' => 'MarkdownV2',
            ],
        ]);

        $url     = "https://api.telegram.org/bot{$this->botToken}/sendMessage";

        $request  = new Request('POST', $url);
        $request  = $request->withBody($multipart);
        $response = $this->sendHttpRequest($request);

        if (!$response['ok']) {
            // TODO: handle error
        }

        return true;
    }

    private static function sendHttpRequest(
        Request $request,
        bool $isReturnJson = true,
        bool $isHandleClientError = true
    ) {
        $client = new Client();

        try {
            $response = $client->send($request);
        } catch (ClientException $e) {
            if ($isHandleClientError) {
                throw $e;
            }

            return false;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }

        return $isReturnJson ?
            json_decode($response->getBody(), true) :
            $response;
    }
}
