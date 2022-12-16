// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu3v7fyGjGSfZ82TYyMngS9TRLfHV8TsU",
  authDomain: "cdio-iot.firebaseapp.com",
  databaseURL: "https://cdio-iot-default-rtdb.firebaseio.com",
  projectId: "cdio-iot",
  storageBucket: "cdio-iot.appspot.com",
  messagingSenderId: "963091021230",
  appId: "1:963091021230:web:e84e7e313ab6075041dc3f",
  measurementId: "G-M5HHSE8D4S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
