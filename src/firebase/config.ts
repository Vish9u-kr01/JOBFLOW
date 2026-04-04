const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-9235458155-d4ab2";

export const firebaseConfig = {
  projectId,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:706325653821:web:5a8a1e3cbd2ff87e487d54",
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBa9rdZKHlYml4LkxOBnyDO-dtTjSo-bro",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "studio-9235458155-d4ab2.firebaseapp.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "706325653821",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  storageBucket: `${projectId}.appspot.com`, // ✅ FIXED
};