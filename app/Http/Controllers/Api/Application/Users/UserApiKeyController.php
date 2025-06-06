<?php

namespace Pterodactyl\Http\Controllers\Api\Application\Users;

use Pterodactyl\Models\User;
use Pterodactyl\Models\ApiKey;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Transformers\Api\Application\ApiKeyTransformer;
use Pterodactyl\Http\Controllers\Api\Application\ApplicationApiController;
use Pterodactyl\Http\Requests\Api\Application\Users\StoreUserApiKeyRequest;

class UserApiKeyController extends ApplicationApiController
{
    public function store(StoreUserApiKeyRequest $request, User $user): array
    {
        if ($user->apiKeys()->where('key_type', ApiKey::TYPE_ACCOUNT)->count() >= 25) {
            throw new DisplayException('You have reached the account limit for number of API keys.');
        }

        $token = $user->createToken(
            $request->input('description'),
            $request->input('allowed_ips')
        );

        Activity::event('user:api-key.create')
            ->subject($token->accessToken)
            ->property('identifier', $token->accessToken->identifier)
            ->log();

        return $this->fractal->item($token->accessToken)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->addMeta(['secret_token' => $token->plainTextToken])
            ->toArray();
    }
}
