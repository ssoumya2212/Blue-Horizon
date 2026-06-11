# Project Structure Overview

This document provides a detailed overview of the folder hierarchy and file placement in the Blue Horizon School Bus Tracking system.

---

## Workspace Root Directories

- **`src/`**: The core source code of the web application.
- **`electron/`**: Electron main and renderer process configuration for packaging the app as a Windows desktop utility.
- **`android/`**: Capacitor native Android project folder, used to build and compile the APK/AAB for Android mobile deployment.
- **`public/`**: Static public assets (icons, images, manifest, icons for platforms) that do not require bundler compilation.
- **`release/`**: Generated build output folder for desktop release packages.
- **`dist/`**: Automatically generated production client/server web assets produced by `npm run build`.

---

## Source Directory (`src/`) Details

### 1. `src/types/`
Houses all global TypeScript interfaces and schema declarations used to describe model entities mapping back to Supabase.
- **[db.ts](file:///c:/Users/soumy/OneDrive/Desktop/PDD/src/types/db.ts)**: Declares core models such as `Profile` (admin, driver, parent), `Student`, `ParentDetail`, `DriverDetail`, `Route`, `Trip`, `PickupLog`, and `DropLog`.

### 2. `src/routes/`
Contains file-based routing views powered by TanStack Router/Start.
- **`__root.tsx`**: Defines the root layout, error boundaries, navigation links, and standard styles wrapper.
- **`login.tsx`**: Renders the login selector interface (Admin, Parent, Driver) and validates permissions against Supabase profiles.
- **`app.admin.tsx`**: Renders the Admin dashboard dashboard with real-time stats cards, map views, and entity operations (buses, routes, parents, drivers).
- **`app.parent.tsx`**: Renders the Parent portal dashboard, providing onboarding dialogs, active trip tracking, and arrival checkins.
- **`app.driver.tsx`**: Renders the Driver portal operations interface, including trip controllers, passenger onboarding forms, and coordinates streaming.
- **`app.students.tsx`**, **`app.drivers.tsx`**, **`app.buses.tsx`**, **`app.routes.tsx`**: Dedicated CRUD management tabs/pages for admins.
- **`app.reports.tsx`**, **`app.analytics.tsx`**, **`app.settings.tsx`**, **`app.notifications.tsx`**, **`app.emergency.tsx`**: Utility tabs for analytics, user notification feeds, profile edits, and emergency alerts.

### 3. `src/components/`
Modular UI widgets and visual layouts reused across multiple pages.
- **`ThemeToggle.tsx`**: Theme swapper for dark mode support.
- **`RouteMapClient.tsx`** & **`FleetMapClient.tsx`**: Dynamic Leaflet maps loaded asynchronously for rendering bus movement tracks.
- **UI Primitives (`src/components/ui/`)**: Reusable components configured using Tailwind CSS and Radix UI primitives (e.g., `Button`, `Dialog`, `DropdownMenu`, `Card`, `Table`, etc.).

### 4. `src/lib/`
Configuration libraries and internal utilities.
- **`supabase.ts`**: Initializes the frontend Supabase JS client.
- **`auth.ts`**: Provides helper functions to query authenticated profile data and session variables.
- **`drivers.ts`** & **`parents.ts`**: Standard helper wrappers for performing updates.
- **`utils.ts`**: Standard helper function (`cn`) to merge classnames cleanly using Tailwind CSS utility styles.

### 5. `src/server-functions/`
Server-side operations executed under server runtime environments (TanStack Start Server Actions).
- **`admin_actions.ts`**: Executes privileged actions using the `SUPABASE_SERVICE_ROLE_KEY` to administer accounts (creating users, editing accounts, deletion, and disabling profiles safely).

### 6. `src/hooks/`
Custom React hooks.
- **`useAutoUpdate.ts`**: Handles Capacitor-based app updates and local push notification registers.
- **`useRealtimeSubscription.ts`**: General hook framework for managing realtime table subscription channels in the UI.

---

## Configuration Files

- **`package.json`**: Lists all npm dependencies, build scripts, and build packaging parameters.
- **`tsconfig.json`**: TypeScript project rules and directory path aliases (`@/*` mapping to `src/*`).
- **`vite.config.ts`**: Configures the dev and compilation build server pipelines.
- **`capacitor.config.ts`**: Mobile configuration options for linking the web views into Android.
- **`wrangler.jsonc`**: Configuration details for deployment on Cloudflare Workers/Pages.
