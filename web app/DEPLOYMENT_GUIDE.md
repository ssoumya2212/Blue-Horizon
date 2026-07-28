# Blue Horizon Deployment & Build Guide

This document provides instructions for deploying the Web App, and building the native Android and Windows applications.

## 1. Web Application (Vercel)

The web application is built using React, Vite, and TanStack Router, and is configured for deployment on Vercel.

### Deployment Steps

1. Push your code to GitHub.
2. In the Vercel dashboard, click **Add New** -> **Project**.
3. Import your Blue Horizon repository.
4. Ensure the Framework Preset is recognized correctly (Vite).
5. Set your Environment Variables matching your `.env` file (e.g., Supabase URL, Anon Key, Firebase Config).
6. Click **Deploy**.

**Commands Used Automatically by Vercel:**

- Build Command: `npm run build`
- Output Directory: `dist/client`

---

## 2. Android Build (Capacitor)

The mobile application is wrapped using Ionic Capacitor. This allows you to generate native Android `.apk` and `.aab` (Android App Bundle) files using your existing web codebase.

### Prerequisites

- Android Studio installed.
- Java Development Kit (JDK 17+) installed.
- Android SDK installed and configured.

### Build Steps

1. **Install Dependencies:**
   Ensure all dependencies are installed.

   ```bash
   npm install
   ```

2. **Sync Web Assets to Capacitor:**
   This copies your compiled web app into the Android folder.

   ```bash
   npm run android:sync
   ```

3. **Open in Android Studio (Optional):**
   If you want to manually run the app on an emulator.

   ```bash
   npx cap open android
   ```

4. **Generate APK (Debug/Testing):**
   This command builds the `.apk` file for testing.

   ```bash
   npm run android:apk
   ```

   _Output Location:_ `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Generate AAB (Play Store Release):**
   This command builds the signed Android App Bundle required by the Google Play Store.
   ```bash
   npm run android:aab
   ```
   _Output Location:_ `android/app/build/outputs/bundle/release/app-release.aab`
   _(Note: You will need to configure your signing keystore in `android/app/build.gradle` for a signed release)._

---

## 3. Windows Build (Electron)

The desktop application uses Electron to provide a native Windows executable (`.exe`) installer.

### Prerequisites

- Node.js installed on a Windows machine.

### Build Steps

1. **Test Electron Locally (Dev Mode):**
   To test the Electron wrapper locally before compiling.

   ```bash
   npm run electron:dev
   ```

2. **Generate Windows EXE Installer:**
   This command builds the Vite app and then packages it using `electron-builder` into a standalone installer.
   ```bash
   npm run electron:build
   ```
   _Output Location:_ Check the generated `release` folder in your project root. You will find the `Blue Horizon Setup x.x.x.exe` installer inside.

---

## 4. Release Management

Once you have generated your `.apk` or `.exe` files:

1. Log in to the Blue Horizon web app using an **Admin** account.
2. Navigate to **Settings**.
3. Scroll down to the **Release Management (Admin Only)** section.
4. Click **New Release**.
5. Select the platform (Android or Windows), enter the version number, upload the `.apk` or `.exe` file, and provide release notes.
6. The file will be securely uploaded to Supabase Storage, and users will immediately see the updated download links on the `/downloads` page.
7. Users opening the app will automatically receive an update notification if their version is outdated.
