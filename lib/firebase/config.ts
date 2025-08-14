import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBE0pnmM_QucwJT3oBTB9v_JKfzPUr0tEM",
  authDomain: "nyumba-73c6c.firebaseapp.com",
  projectId: "nyumba-73c6c",
  storageBucket: "nyumba-73c6c.firebasestorage.app",
  messagingSenderId: "468103619139",
  appId: "1:468103619139:web:6939567b3cb395e0dd6af6",
  measurementId: "G-TCKS5K89MG",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics only on client side
export const analytics =
  typeof window !== "undefined" && typeof document !== "undefined"
    ? (() => {
        try {
          return getAnalytics(app)
        } catch (error) {
          console.warn("Analytics initialization failed:", error)
          return null
        }
      })()
    : null

export default app
