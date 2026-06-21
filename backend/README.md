# Rickverse Backend

The Rickverse backend is an ASP.NET Core 9 Web API responsible for account registration, login, JWT authentication, current-user details, and persistent favorite-character records.

- Deployed health check: [https://rick-morty-platform-ecv1.onrender.com/health](https://rick-morty-platform-ecv1.onrender.com/health)
- Full project guide: [../README.md](../README.md)

## Stack

- ASP.NET Core 9 Web API
- ASP.NET Core Identity
- Entity Framework Core 9
- SQLite
- JWT Bearer authentication
- Swagger / OpenAPI
- xUnit and Moq

## Architecture

```text
RickMorty.Api/
├── Controllers/       HTTP routing, authorization, and response mapping
├── Contracts/         API request and response models
├── Domain/            Identity and favorite-character entities
├── DataAccess/
│   ├── External/      Rick and Morty character validation client
│   ├── Migrations/    EF Core schema migrations
│   └── Repositories/  Favorite persistence abstraction
└── Services/          Authentication, favorites, and JWT business logic
```

Controllers depend on service interfaces, services depend on repository or external-client interfaces, and EF Core implementation details remain in Data Access. A unique database index prevents duplicate favorites for the same user and character.

## Local setup

### Prerequisites

- .NET 9 SDK

From the repository root:

```bash
cd backend/RickMorty.Api
dotnet restore
dotnet user-secrets set "Jwt:Key" "replace-with-a-random-key-at-least-32-characters-long"
dotnet run
```

The application runs at `http://localhost:5048`. On startup it automatically applies pending EF Core migrations and creates the local `rickmorty.db` file if needed.

Development Swagger UI:

```text
http://localhost:5048/swagger
```

SQLite database files, local secrets, build output, and test output are excluded from Git.

## Configuration

Default non-secret settings are stored in `RickMorty.Api/appsettings.json`. Production settings should be supplied through environment variables.

| Environment variable | Required | Description |
| --- | --- | --- |
| `Jwt__Key` | Yes | Secret signing key with at least 32 characters |
| `Jwt__Issuer` | No | JWT issuer; default `RickMorty.Api` |
| `Jwt__Audience` | No | JWT audience; default `RickMorty.Web` |
| `Jwt__ExpirationMinutes` | No | Access-token lifetime; default `60` |
| `ConnectionStrings__DefaultConnection` | No | SQLite connection string; default `Data Source=rickmorty.db` |
| `FrontendOrigin` | Production | Exact frontend origin allowed by CORS |
| `PORT` | Render | Listening port supplied automatically by Render |

Never commit `Jwt__Key` or production environment values.

## API endpoints

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register and return a JWT |
| `POST` | `/api/auth/login` | Public | Authenticate and return a JWT |
| `GET` | `/api/users/me` | Bearer JWT | Return the current account |
| `GET` | `/api/users/me/favorites` | Bearer JWT | List saved character IDs |
| `POST` | `/api/users/me/favorites/{characterId}` | Bearer JWT | Save a character |
| `DELETE` | `/api/users/me/favorites/{characterId}` | Bearer JWT | Remove a saved character |
| `GET` | `/health` | Public | Render health check |

Authenticated requests use:

```http
Authorization: Bearer <access-token>
```

Registration validates unique usernames and emails. Five unsuccessful login attempts temporarily lock the account for five minutes. Favorite creation validates the character ID against the Rick and Morty API.

## Database migrations

Existing migrations are applied automatically during application startup. To create a new migration during development:

```bash
cd backend/RickMorty.Api
dotnet ef migrations add MigrationName --output-dir DataAccess/Migrations
```

Install the EF CLI first if it is not already available:

```bash
dotnet tool install --global dotnet-ef --version 9.*
```

## Tests

Stop a locally running Debug API process before running the full solution tests on Windows, then run:

```bash
cd backend
dotnet test RickMortyPlatform.sln -c Release
```

The backend suite contains 12 tests covering:

- duplicate and invalid favorite requests
- successful favorite persistence and deletion
- concurrent duplicate-insert handling
- registration and Identity validation outcomes
- successful and locked-out login behavior
- JWT claims, signature validation, and expiration

## Docker

Build from the repository root:

```bash
docker build -f backend/Dockerfile -t rickmorty-api backend
```

Run the container locally:

```bash
docker run --rm -p 10000:10000 \
  -e PORT=10000 \
  -e Jwt__Key=replace-with-a-random-key-at-least-32-characters-long \
  -e FrontendOrigin=http://localhost:5173 \
  rickmorty-api
```

PowerShell users can place the command on one line or replace `\` with PowerShell backticks.

## Render deployment

The repository-level `render.yaml` defines the Docker build context, health check, and non-secret environment values. Create a Render Blueprint from the repository, provide `FrontendOrigin`, and allow Render to generate `Jwt__Key`.

For manual Web Service setup:

| Setting | Value |
| --- | --- |
| Runtime | Docker |
| Root Directory | `backend` |
| Dockerfile Path | `backend/Dockerfile` |
| Health Check Path | `/health` |

The demonstration deployment stores SQLite inside the container without a persistent disk. User and favorite data can be reset after a rebuild or service replacement. A managed relational database should be used when durable production storage is required.
