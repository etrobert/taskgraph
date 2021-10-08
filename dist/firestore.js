import {initializeApp} from "../_snowpack/pkg/firebase/app.js";
import {getFirestore} from "../_snowpack/pkg/firebase/firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyC3Le2ZBbGHEzjgk3yCNxh3Ioj8iNIC-EY",
  authDomain: "taskgraph-e9cf9.firebaseapp.com",
  databaseURL: "https://taskgraph-e9cf9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taskgraph-e9cf9",
  storageBucket: "taskgraph-e9cf9.appspot.com",
  messagingSenderId: "289117132023",
  appId: "1:289117132023:web:10e62360aa751864e06ff2",
  measurementId: "G-DKBYJ7EZBY"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export default firestore;
