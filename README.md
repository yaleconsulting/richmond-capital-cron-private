# Cron Runner

A lightweight Node.js cron job runner that triggers HTTP endpoints on configurable schedules.

## Features

- Multiple cron schedules (5min, 30min, 2hour, daily)
- Custom authentication header support
- Development mode with accelerated timing for testing
- Timezone-aware scheduling (America/New_York)
- Non-overlapping job execution

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file and configure:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your settings.

## Environment Variables

| Variable            | Description                                      | Example                          |
| ------------------- | ------------------------------------------------ | -------------------------------- |
| `NODE_ENV`          | Environment mode (`development` or `production`) | `development`                    |
| `ENABLED`           | Enable/disable cron jobs                         | `true`                           |
| `URL`               | Base Docker URL for cron endpoints               | `http://localhost:3000/api/cron` |
| `AUTH_HEADER`       | Name of the authentication header                | `Authorization`                  |
| `AUTH_HEADER_VALUE` | Value for the authentication header              | `your-secret-token`              |

## Usage

**Development** (runs jobs every 10 seconds for testing):

```bash
pnpm dev
```

**Production**:

```bash
pnpm start
```

## Cron Schedules

| Job   | Development      | Production           |
| ----- | ---------------- | -------------------- |
| 5min  | Every 10 seconds | Every 5 minutes      |
| 30min | Every 10 seconds | Every 30 minutes     |
| 2hour | Every 10 seconds | Every 2 hours        |
| daily | Every 10 seconds | Daily at 10:00 AM ET |
