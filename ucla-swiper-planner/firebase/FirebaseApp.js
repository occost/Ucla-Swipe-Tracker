// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REDACTED-API-KEY",
  authDomain: "REDACTED-AUTH-DOMAIN",
  databaseURL: "REDACTED-DATABASE-URL",
  projectId: "REDACTED-PROJECT-ID",
  storageBucket: "REDACTED-STORAGE-BUCKET",
  messagingSenderId: "REDACTED-MESSAGING-SENDER-ID",
  appId: "REDACTED-APP-ID",
  measurementId: "REDACTED-MEASUREMENT-ID"

  // THIS WILL BE USED ONCE WE FIGURE OUT THE .ENV FILES AND DEPLOYMENT
  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //retrieves our firebase using our api key

export default app; //exports it 

// Initialize Firestore
export const db = getFirestore(app);
