import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './FirebaseConfig';
import { useState } from 'react';

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

function App() {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: '',
    });

    const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(res => {
                const { displayName, email, photoURL } = res.user;
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
                    success: false,
                };
                setUser(signOutUser);
            })
            .catch(err => console.log(err));
    };

    const handleBlur = e => {
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const passwordValid = e.target.value.length > 6;
            const passwordHasNum = /\d{1}/.test(e.target.value);
            isFieldValid = passwordValid && passwordHasNum;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    };

    const handleSubmit = e => {
        if (newUser && user.email && user.password) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then(userCredential => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }

        if (!newUser && user.email && user.password) {
            firebase
                .auth()
                .signInWithEmailAndPassword(user.email, user.password)
                .then(userCredential => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }
        e.preventDefault();
    };

    const updateUserName = name => {
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name,
        })
            .then(() => {
                console.log('updated name');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="App">
            {!user.isSignIn ? (
                <button onClick={handleSignIn}>Sign in</button>
            ) : (
                <button onClick={handleSignOut}>Sign out</button>
            )}
            <br />
            <button>Sign in using Facebook</button>
            {user.isSignIn && (
                <div>
                    <p>Welcome {user.name}</p>
                    <p>Email {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            )}

            <h1>Our own authentication</h1>

            <input
                type="checkbox"
                onClick={() => setNewUser(!newUser)}
                name="newUser"
                id=""
            />
            <label htmlFor="newUser">New user Sign up</label>

            <form onSubmit={handleSubmit}>
                {newUser && (
                    <input
                        type="text"
                        onBlur={handleBlur}
                        name="name"
                        placeholder="your name"
                    />
                )}
                <br />
                <input
                    type="email"
                    onBlur={handleBlur}
                    name="email"
                    placeholder="your email"
                    required
                />
                <br />
                <input
                    type="password"
                    onBlur={handleBlur}
                    name="password"
                    placeholder="enter password"
                    required
                />
                <br />{' '}
                <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
            </form>
            {user.success ? (
                <p style={{ color: 'green' }}>
                    User{newUser ? 'created ' : 'logged In'}success
                </p>
            ) : (
                <p style={{ color: 'red' }}>{user.error}</p>
            )}
        </div>
    );
}

export default App;
