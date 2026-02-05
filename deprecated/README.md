# Deprecated Files

This folder contains deprecated code and data files that are no longer used in the application.

## What's Deprecated

### `data/`
Contains CSV and JSON files that were previously used for local data storage. These are no longer needed as all data is now fetched directly from Cockpit CMS API client-side.

### `public-data/`
Contains generated JSON files that were served statically. No longer needed as data is now fetched from Cockpit API at runtime.

### `scripts/`
Contains data synchronization scripts (sync-data.ts, notion-sync.ts, etc.) that were used to generate static JSON files. No longer needed with the new client-side API approach.

### `server-api/`
Contains Nuxt server API routes that were used to serve data from static JSON files. No longer needed as all data is fetched directly from Cockpit CMS client-side.

### `server-utils/`
Contains server-side utility functions for CSV parsing, Cockpit API calls, etc. No longer needed as all API calls are now client-side.

## New Architecture

The application now:
1. Fetches all data directly from Cockpit CMS API (https://hirelemon.com/bar/api) on the client side
2. Uses the `useCockpitAPI()` composable for all data fetching
3. Displays errors on screen if API calls fail
4. Uses a read-only API key that is safe to expose publicly

## API Configuration

API constants are defined in `/utils/cockpitConfig.ts`:
- `COCKPIT_API_URL`: The base URL for Cockpit CMS API
- `COCKPIT_API_KEY`: Read-only API key (safe to expose publicly)

## If You Need These Files

These files are kept for reference only. If you need to restore any functionality, please review the new client-side architecture first and ensure it's the right approach.
