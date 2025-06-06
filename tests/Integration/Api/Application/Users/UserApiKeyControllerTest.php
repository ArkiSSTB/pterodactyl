<?php

namespace Pterodactyl\Tests\Integration\Api\Application\Users;

use Pterodactyl\Models\User;
use Illuminate\Http\Response;
use Pterodactyl\Models\ApiKey;
use Pterodactyl\Services\Acl\Api\AdminAcl;
use Pterodactyl\Transformers\Api\Application\ApiKeyTransformer;
use Pterodactyl\Tests\Integration\Api\Application\ApplicationApiIntegrationTestCase;

class UserApiKeyControllerTest extends ApplicationApiIntegrationTestCase
{
    protected function tearDown(): void
    {
        ApiKey::query()->forceDelete();

        parent::tearDown();
    }

    public function testApiKeyCanBeCreatedForUser()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/application/users/' . $user->id . '/api-keys', [
            'description' => 'Test Key',
            'allowed_ips' => ['127.0.0.1'],
        ]);

        $response->assertStatus(Response::HTTP_OK)
            ->assertJsonPath('object', ApiKey::RESOURCE_NAME);

        $key = ApiKey::query()->where('identifier', $response->json('attributes.identifier'))->firstOrFail();

        $response->assertJson([
            'object' => ApiKey::RESOURCE_NAME,
            'attributes' => $this->getTransformer(ApiKeyTransformer::class)->transform($key),
            'meta' => ['secret_token' => decrypt($key->token)],
        ], true);
    }

    public function testApiKeyLimitIsApplied()
    {
        $user = User::factory()->create();
        ApiKey::factory()->times(25)->for($user)->create([
            'key_type' => ApiKey::TYPE_ACCOUNT,
        ]);

        $this->postJson('/api/application/users/' . $user->id . '/api-keys', [
            'description' => 'Test Key',
        ])
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonPath('errors.0.code', 'DisplayException');
    }

    public function testApiKeyWithoutPermissionIsDenied()
    {
        $user = User::factory()->create();
        $this->createNewDefaultApiKey($this->getApiUser(), ['r_users' => AdminAcl::READ]);

        $response = $this->postJson('/api/application/users/' . $user->id . '/api-keys', [
            'description' => 'Test',
        ]);

        $this->assertAccessDeniedJson($response);
    }
}
