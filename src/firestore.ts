import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3Le2ZBbGHEzjgk3yCNxh3Ioj8iNIC-EY",
  authDomain: "taskgraph-e9cf9.firebaseapp.com",
  databaseURL:
    "https://taskgraph-e9cf9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taskgraph-e9cf9",
  storageBucket: "taskgraph-e9cf9.appspot.com",
  messagingSenderId: "289117132023",
  appId: "1:289117132023:web:10e62360aa751864e06ff2",
  measurementId: "G-DKBYJ7EZBY",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

// ARCHITECTURE DECISION:
// Use a collection projects
// Each document contains a Map of Arrays of Maps like so:
// {
//   tasks: [{
//     id: '',
//     name: '',
//     position: {
//       x: 0,
//       y: 0,
//     }
//   }],
//   dependencies: []
// }
// When the size of a project will grow above 1MB it will be time to change

export default firestore;
