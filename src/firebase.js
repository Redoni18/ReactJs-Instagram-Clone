import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCpAZ0qLEG4XVrNSZQlhrvfwCJ-GWIsFcQ",
    authDomain: "instagram-clone-react-b24fc.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-b24fc.firebaseio.com",
    projectId: "instagram-clone-react-b24fc",
    storageBucket: "instagram-clone-react-b24fc.appspot.com",
    messagingSenderId: "140034000765",
    appId: "1:140034000765:web:cb6de50e74e4f16cf86e14",
    measurementId: "G-9JT0WQZ4NY"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};