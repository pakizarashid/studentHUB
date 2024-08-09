import axios from "axios";
import firebase from "./firebaseConfig";

const API_KEY = "";

async function authenticate(mode, email, password) {
  const url = ``;

  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
    console.log('Authentication successful:', response.data);

    return response.data; // Return response data
  } catch (error) {
    throw error;
        console.error('Authentication error:', error);

  }
}

export async function createUser(email, password) {
  try {
    const responseData = await authenticate("signUp", email, password);
    return responseData; // Return response data
  } catch (error) {
      console.error('Create user error:', error);

    throw error;
  }
}

export async function sendPasswordResetEmail(email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    throw error; 
  }
}


export async function login(email, password) {
  try {
    await authenticate("signInWithPassword", email, password);

    const response = await firebase.auth().signInWithEmailAndPassword(email, password);
    const userId = response.user.uid;

    // Check if user is student, teacher, or admin
    let userDataSnapshot = await firebase.database().ref(`students`).orderByChild("email").equalTo(email).once('value');
    let userData = userDataSnapshot.val();

    if (!userData) {
      userDataSnapshot = await firebase.database().ref(`teachers`).orderByChild("email").equalTo(email).once('value');
      userData = userDataSnapshot.val();
    }

    if (!userData) {
      userDataSnapshot = await firebase.database().ref(`admins`).orderBy("email").equalTo(email).once('value');
      userData = userDataSnapshot.val();
    }

    if (!userData) {
      throw new Error("User data not found");
    }

    return { userId, userData };
  } catch (error) {
    throw error;
  }
}
