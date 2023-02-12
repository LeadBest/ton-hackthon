<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\MultipartStream;
use GuzzleHttp\Psr7\Request;

class TelegramService
{
    protected $botToken;
    protected $groupChatId;

    public function __construct() {
        $this->botToken    = config('app.telegram_bot_token');
        $this->groupChatId = config('app.telegram_dobby_room');
    }

    public function getChatMember(string $userId)
    {
        $url      = "https://api.telegram.org/bot{$this->botToken}/getChatMember?chat_id={$this->groupChatId}&user_id={$userId}";

        $request = new Request('GET', $url);

        return $this->sendHttpRequest($request);
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
        $request = new Request('POST', $url);
        $request = $request->withBody($multipart);

        return $this->sendHttpRequest($request);
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
