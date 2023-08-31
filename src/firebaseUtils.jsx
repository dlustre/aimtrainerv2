// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDd65QKHGbVHW0C-MrfpdY7qg7mIRVdP3g",
    authDomain: "aim-trainer-c963d.firebaseapp.com",
    projectId: "aim-trainer-c963d",
    storageBucket: "aim-trainer-c963d.appspot.com",
    messagingSenderId: "102889036618",
    appId: "1:102889036618:web:ddb1864b1826607b797fb3",
    measurementId: "G-1RHTMTC9G6",
    databaseURL: `https://aim-trainer-c963d.firebaseio.com`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

export const checkUserExists = async (username, password) => {
    try {
        const cred = await signInWithEmailAndPassword(auth, username + '@aimtrainer.com', password);
        console.log(`User exists and signed in successfully: ${cred.user.uid}`);
        return cred.user.uid;
    } catch (error) {
        // console.error('User does not exist or error occurred:', error);
        return false;
    }
};

export const createNewAccount = async (username, password) => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, username + '@aimtrainer.com', password);
        writeUserData(cred.user.uid, username);
        console.log(`New user account created successfully: ${cred.user.uid}`);
        return cred.user.uid;
    } catch (error) {
        // console.error('Error creating new account:', error);
        return false;
    }
};

export const writeUserData = async (userId, username) => {
    console.log(`start adding user data for ${username}`);
    try {
        await setDoc(doc(db, "users", userId), {
            username,
            bestScore: 0
        });
        console.log(`doc created for ${username}`);
    } catch (error) {
        console.error("Error adding user data:", error);
    }
};

export function updateBestScore(userId, bestScore) {
    updateDoc(doc(db, 'users', userId), { bestScore });
}

export const getBestScore = async (userId) => {
    console.log('Attempting to fetch best score for user:', userId);

    try {
        const docSnap = await getDoc(doc(db, "users", userId));
        console.log('docSnap data:', docSnap.data());
        return docSnap.data().bestScore;
    } catch (error) {
        console.error('Error fetching best score:', error);
    }
};

export const fetchAllUsers = async () => {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);

    const users = [];
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });

    return users;
};

// Call the function to fetch all users
fetchAllUsers().then((users) => {
    console.log(users); // Do something with the fetched users data
});