## 🔧 Custom Admin Feature: Generate Client API Tokens for Users

This fork of **Pterodactyl Panel** introduces a convenient **Application API** endpoint that allows **administrators to generate client tokens on behalf of users** — useful for automated deployments, integrations, and scripting.

---

### ✅ New Endpoint

**POST** `/api/application/users/{user:id}/api-keys`
Create a new **Client API token** for the specified user.

* 🔐 Requires an Application API key with `write` access to the `users` resource (`r_users ≥ 2`)
* 📌 Maximum 25 API keys per user (limit enforced)

---

### 📦 Example Request (cURL)

```bash
curl -X POST "https://panel.example.com/api/application/users/42/api-keys" \
     -H "Authorization: Bearer PTLA_xxxxx" \
     -H "Content-Type: application/json" \
     -d '{
           "description": "Deploy script",
           "allowed_ips": ["127.0.0.1"]
         }'
```

---

### 📤 Example Response

```json
{
  "object": "api_key",
  "attributes": {
    "identifier": "abcd1234",
    "description": "Deploy script",
    "allowed_ips": ["127.0.0.1"],
    "last_used_at": null,
    "created_at": "2025-06-06T15:52:10+00:00"
  },
  "meta": {
    "secret_token": "ptlc_a1b2c3d4e5..."
  }
}
```

> You can pass the returned token directly to the Client API using the `Authorization: Bearer` header.

---

### ⚙️ Implementation Details

* ✅ **Route registered** in `routes/api.php` under `application` scope:

  ```php
  Route::post('/{user:id}/api-keys', [UserApiKeyController::class, 'store']);
  ```

* ✅ **Key creation** handled via `createToken()` method:

  ```php
  $token = $user->createToken($description, $allowedIps);
  ```

* ✅ **Validation rules** include:

  ```php
  'description' => 'string|required|max:255',
  'allowed_ips' => 'array|max:50',
  'allowed_ips.*' => 'string'
  ```

* ✅ Response transformer appends `secret_token` to the metadata.

---

### 📌 Notes

* No UI changes were made — this feature is **API-only**
* Supports all standard token usage like `/api/client/account`, `/api/client/servers`, etc.
* You can disable IP restriction by passing an empty array `[]`

---



[![Logo Image](https://cdn.pterodactyl.io/logos/new/pterodactyl_logo.png)](https://pterodactyl.io)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pterodactyl/panel/ci.yaml?label=Tests&style=for-the-badge&branch=1.0-develop)
![Discord](https://img.shields.io/discord/122900397965705216?label=Discord&logo=Discord&logoColor=white&style=for-the-badge)
![GitHub Releases](https://img.shields.io/github/downloads/pterodactyl/panel/latest/total?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/pterodactyl/panel?style=for-the-badge)

# Pterodactyl Panel

Pterodactyl® is a free, open-source game server management panel built with PHP, React, and Go. Designed with security
in mind, Pterodactyl runs all game servers in isolated Docker containers while exposing a beautiful and intuitive
UI to end users.

Stop settling for less. Make game servers a first class citizen on your platform.

![Image](https://cdn.pterodactyl.io/site-assets/pterodactyl_v1_demo.gif)

## Documentation

* [Panel Documentation](https://pterodactyl.io/panel/1.0/getting_started.html)
* [Wings Documentation](https://pterodactyl.io/wings/1.0/installing.html)
* [Community Guides](https://pterodactyl.io/community/about.html)
* Or, get additional help [via Discord](https://discord.gg/pterodactyl)

## Sponsors

I would like to extend my sincere thanks to the following sponsors for helping fund Pterodactyl's development.
[Interested in becoming a sponsor?](https://github.com/sponsors/matthewpi)

| Company                                                                           | About                                                                                                                                                                                                                                           |
|-----------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [**Aussie Server Hosts**](https://aussieserverhosts.com/)                         | No frills Australian Owned and operated High Performance Server hosting for some of the most demanding games serving Australia and New Zealand.                                                                                                 |
| [**BisectHosting**](https://www.bisecthosting.com/)                               | BisectHosting provides Minecraft, Valheim and other server hosting services with the highest reliability and lightning fast support since 2012.                                                                                                 |
| [**MineStrator**](https://minestrator.com/)                                       | Looking for the most highend French hosting company for your minecraft server? More than 24,000 members on our discord trust us. Give us a try!                                                                                                 |
| [**HostEZ**](https://hostez.io)                                                   | US & EU Rust & Minecraft Hosting. DDoS Protected bare metal, VPS and colocation with low latency, high uptime and maximum availability. EZ!                                                                                                     |
| [**Blueprint**](https://blueprint.zip/?utm_source=pterodactyl&utm_medium=sponsor) | Create and install Pterodactyl addons and themes with the growing Blueprint framework - the package-manager for Pterodactyl. Use multiple modifications at once without worrying about conflicts and make use of the large extension ecosystem. |
| [**indifferent broccoli**](https://indifferentbroccoli.com/)                      | indifferent broccoli is a game server hosting and rental company. With us, you get top-notch computer power for your gaming sessions. We destroy lag, latency, and complexity--letting you focus on the fun stuff.                              |

### Supported Games

Pterodactyl supports a wide variety of games by utilizing Docker containers to isolate each instance. This gives
you the power to run game servers without bloating machines with a host of additional dependencies.

Some of our core supported games include:

* Minecraft — including Paper, Sponge, Bungeecord, Waterfall, and more
* Rust
* Terraria
* Teamspeak
* Mumble
* Team Fortress 2
* Counter Strike: Global Offensive
* Garry's Mod
* ARK: Survival Evolved

In addition to our standard nest of supported games, our community is constantly pushing the limits of this software
and there are plenty more games available provided by the community. Some of these games include:

* Factorio
* San Andreas: MP
* Pocketmine MP
* Squad
* Xonotic
* Starmade
* Discord ATLBot, and most other Node.js/Python discord bots
* [and many more...](https://pterodactyleggs.com)

## License

Pterodactyl® Copyright © 2015 - 2022 Dane Everitt and contributors.

Code released under the [MIT License](./LICENSE.md).
