import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './FirebaseConfig';
import { useState } from 'react';

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

function App() {
   const [user, setUser] = useState({
      isSignIn: false,
      name: '',
      email: '',
      photo: '',
   });
   const provider = new firebase.auth.GoogleAuthProvider();

   const handleSignIn = () => {
      firebase
         .auth()
         .signInWithPopup(provider)
         .then(res => {
            const { displayName, email, photoURL } = res?.user;
            const signInUser = {
               isSignIn: true,
               name: displayName,
               email: email,
               photo: photoURL,
            };
            setUser(signInUser);
         })
         .then(error => console.log(error));
   };

   const handleSignOut = () => {
      firebase
         .auth()
         .signOut()
         .then(res => {
            const signOutUser = {
               isSignIn: false,
               name: '',
               email: '',
               photo: '',
            };
            setUser(signOutUser);
         })
         .catch(err => console.log(err));
   };
   return (
      <div className="App">
         {!user.isSignIn ? (
            <button onClick={handleSignIn}>Sign in</button>
         ) : (
            <button onClick={handleSignOut}>Sign out</button>
         )}
         {user.isSignIn && (
            <div>
               <p>Welcome {user.name}</p>
               <p>Email {user.email}</p>
               <img src={user.photo} alt="" />
            </div>
         )}
      </div>
   );
}

export default App;
