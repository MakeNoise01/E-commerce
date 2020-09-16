import firebase from "firebase/app"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAC46cwu4nlvGIZRzXf4pFdIKdWCFR2aME",
    authDomain: "e-commerce-db-image.firebaseapp.com",
    databaseURL: "https://e-commerce-db-image.firebaseio.com",
    projectId: "e-commerce-db-image",
    storageBucket: "e-commerce-db-image.appspot.com",
    messagingSenderId: "361365288885",
    appId: "1:361365288885:web:283b53531652c1e6ddcbfc",
    measurementId: "G-3CV2J0EPYQ"
  };

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()
export { storage, firebase as default };