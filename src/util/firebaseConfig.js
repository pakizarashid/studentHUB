import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCjSPhRWPWGx_Qe6BLqAo2IQHfRYCPEom8",
  authDomain: "studenthub-e3e5a.firebaseapp.com",
  databaseURL:
    "https://studenthub-e3e5a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "studenthub-e3e5a",
  storageBucket: "studenthub-e3e5a.appspot.com",
  messagingSenderId: "513428265090",
  appId: "1:513428265090:web:1ef5e6929bcdf0877f3c9b",
  measurementId: "G-F5QVET8MP1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

export const firestore = firebase.firestore();