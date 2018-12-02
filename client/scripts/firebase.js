import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyADA1CHP2esTi0NPq0uwGz4v00Nz6nnrUQ",
  authDomain: "indie-trail.firebaseapp.com",
  databaseURL: "https://indie-trail.firebaseio.com",
  projectId: "indie-trail",
  storageBucket: "indie-trail.appspot.com",
  messagingSenderId: "706733429263"
};

firebase.initializeApp(config);

export default firebase;
