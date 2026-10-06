# Hypergames Documentation

Platform integration guide for Hypergames.

Hypergames gives your platform access to a catalogue of games and enables specific games for your platform. For a user to play, you send them to the game embed URL with a set of query parameters. When the game session is finalised, Hypergames sends the resulting score to a webhook URL that you provide.

---

## 1. Identifiers

All identifiers that you send to Hypergames are **UUIDs**. This applies to `entryId`, `userId`, `gameId`, `tournamentId` and `oldTournamentId`. Do not send numeric IDs or slugs for these fields.

---

## 2. Getting your games

Hypergames enables a set of games for your platform and shares that list with you. Each game in the list includes:

- `name`
- `slug`
- `description`
- `posterUrl` / `thumbnailUrl`
- `gameStatus` (e.g. live/inactive)
- the embed URL/path to use for that game

---

## 3. Launching a game (the embed URL)

Hypergames gives you an embed URL per game. To start a play session, send the user to that embed URL with the query parameters below appended. The game reads these parameters and creates the game session with Hypergames on your behalf — you do not need to call any session API yourself.

Example:

```
https://<hypergames-embed-url>
  ?gameId=<uuid>
  &entryId=<uuid>
  &host=<your-platform-host>
  &userId=<uuid>
  &userName=<player display name>
  &tournamentId=<uuid>
  &oldTournamentId=<uuid>
  &pvp=true
```

### 3.1 Query parameters

| Parameter         | Required | Type         | Purpose                                                                                                                                                                                                                     |
| ----------------- | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gameId`          | Yes      | UUID         | Your identifier for the game. Hypergames stores it for tracking and association with the session, alongside the `tournamentId`. It does not affect which game loads (the embed URL does).                                     |
| `entryId`         | Yes      | UUID         | Your unique identifier for this user's entry into the game/tournament. It is how the resulting score is correlated back to you, and it is returned in the score webhook. Use a new `entryId` per entry.                       |
| `host`            | Yes      | URL (string) | The platform host URL. Hypergames uses it to resolve your platform and to determine where the score should go. It must match the host configured for your platform.                                        |
| `userId`          | Yes      | UUID         | Your unique identifier for the player.                                                                                                                                                                                       |
| `userName`        | No       | String       | The player's display name, used inside the game.                                                                                                                                                                              |
| `tournamentId`    | No       | UUID         | Groups entries into a tournament and makes the generated game sequence identical for every entry using it (see section 4).                                                                                                    |
| `oldTournamentId` | No       | UUID         | The previous `tournamentId`. Send it when you need the same game sequence but are switching to a new `tournamentId` (see section 4).                                                                                          |
| `pvp`             | No       | Boolean      | Marks the session as player-vs-player. Defaults to `false` (see section 5).                                                                                                                                                   |

---

## 4. Tournaments and deterministic game sequences

When you send a `tournamentId`, Hypergames looks up an existing session for that tournament and generates a fresh game sequence for that `tournamentId` if non is found. As a result, every entry sent with the **same `tournamentId`** (with different `entryId`s and `userId`s) is given the **same generated game sequence**. This is what allows several players to compete on an identical course/level layout (for most games that support this).

- Use the same `tournamentId` for all participants of a tournament so they all play the same sequence.
- If you need to keep the same sequence but change the tournament identifier, send the previous value as `oldTournamentId`. Hypergames will reuse the sequence from `oldTournamentId` and register the session under the new `tournamentId`.
- `gameId` and `tournamentId` are the two keys Hypergames uses to associate and track sessions for your platform.

---

## 5. Player vs Player (`pvp`)

Include `pvp=true` in the query parameters to mark a session as player-vs-player.

When `pvp` is set:

- Hypergames records the session as a PvP session.
- PvP sessions are subject to additional session and score validation.
- The `pvp` flag is included in the score webhook payload so you can treat PvP results differently.

Omit `pvp` (or send `pvp=false`) for standard single-player sessions (like practice, demos or non ranked games).

---

## 6. Score submission webhook

When a game session is finalised, Hypergames delivers the final score to a webhook URL that your platform provides. This is how you receive the outcome of every entry.

### 6.1 What Hypergames needs from you

- A **webhook URL** that we can `POST` to.
- Optionally, a **webhook API key** (Bearer token) you want us to present on each call. If you do not provide one, Hypergames generates it for you and shares it once.
- A choice of **environment**: `DEV` or `PROD`. You can register a separate webhook per environment.

### 6.2 The webhook API key

Every score webhook call is authenticated with the webhook API key:

```
Authorization: Bearer <webhookApiKey>
```

- If you provided a key, Hypergames uses exactly the key you supplied.
- If you did not provide one, Hypergames generates a key and returns it to you once (store it securely).
- Use this key to verify that the request genuinely came from Hypergames.

### 6.3 The request

```
POST <your-webhook-url>
Content-Type: application/json
Authorization: Bearer <webhookApiKey>
Idempotency-Key: webhook:<entryId>:<sessionId>:<scoreTime>:<cumulativeScore>:<isValid>
```

Body:

```json
{
  "entryId": "00000000-0000-0000-0000-000000000000",
  "gameId": "00000000-0000-0000-0000-000000000000",
  "tournamentId": "00000000-0000-0000-0000-000000000000",
  "time": 132,
  "score": 4200,
  "pvp": false,
  "isValid": true,
  "level": 7, // only if available within the game
  "oldTournamentId": "00000000-0000-0000-0000-000000000000",
  "timeoutType": "IN_GAME"
}
```

Payload fields:

| Field             | Type    | Always present | Purpose                                                                                             |
| ----------------- | ------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `entryId`         | UUID    | Yes            | The `entryId` you sent when launching the game. Use it to map the result back to the entry.          |
| `gameId`          | UUID    | Yes            | The `gameId` you sent when launching the game. Use it with `tournamentId` to associate the result.   |
| `tournamentId`    | UUID    | No             | Present when the session was created with a `tournamentId`.                                          |
| `oldTournamentId` | UUID    | No             | Present when the session was created with an `oldTournamentId`.                                      |
| `score`           | Number  | Yes            | The final cumulative score.                                                                         |
| `time`            | Number  | Yes            | The final in-game time, in seconds.                                                                  |
| `level`           | Number  | No             | The level reached, when the game reports one.                                                        |
| `pvp`             | Boolean | Yes            | Whether this was a player-vs-player session (mirrors the `pvp` query parameter).                     |
| `isValid`         | Boolean | Yes            | Whether Hypergames validated the score as legitimate.                                                |
| `timeoutType`     | String  | No             | Set when the session ended due to a timeout: `PRE_GAME` (never started) or `IN_GAME` (ran too long). |

### 6.4 Your response

- Respond with HTTP `200` to acknowledge the delivery.
- A `4xx` response is treated as terminal — Hypergames will not retry it.
- A `5xx` response or a timeout is retried with backoff.
- Because deliveries can be retried, handle `Idempotency-Key` to avoid processing the same result more than once.

---

## 7. End-to-end summary

1. Hypergames enables a set of games for your platform and shares the list (name, slug, artwork, status, and the embed URL for each).
2. To start a play session, you send the user to the game embed URL with the required query parameters (`gameId`, `entryId`, `host`, `userId`, `embedUrl`) plus any optional ones (`userName`, `tournamentId`, `oldTournamentId`, `pvp`). All IDs are UUIDs.
3. The game creates the session with Hypergames. `gameId` and `tournamentId` are how Hypergames tracks and associates the session for your platform; reusing the same `tournamentId` also produces the same game sequence for every participant.
4. When the session is finalised, Hypergames sends the score to your webhook URL, authenticated with the webhook API key as a Bearer token.
