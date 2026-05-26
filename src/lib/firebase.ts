// Optional Firebase init. Falls back to disabled mode if env vars are missing,
// in which case the tracking layer uses a simulated stream.
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Database | null = null;

export const firebaseEnabled = Boolean(
  config.apiKey && config.databaseURL && config.projectId,
);

if (firebaseEnabled && typeof window !== "undefined") {
  app = initializeApp(config);
  db = getDatabase(app);
}

export function getFirebaseDb() {
  return db;
}
