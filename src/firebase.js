import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDp71S_0CFORYcA87NuEBeUjy7MsTVN9os",
    authDomain: "instagram-clone-57cc6.firebaseapp.com",
    projectId: "instagram-clone-57cc6",
    storageBucket: "instagram-clone-57cc6.appspot.com",
    messagingSenderId: "850058217990",
    appId: "1:850058217990:web:37a45a2e29a5a64a9f5187",
    measurementId: "G-B03XE8S5Q5"
})

 const db = firebaseApp.firestore();
 const auth = firebase.auth();
 const storage = firebase.storage();

 export {db, auth,storage};