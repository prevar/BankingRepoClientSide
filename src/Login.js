import React from "react";
import { useState, useContext, useEffect } from "react";
import { auth, SERVER_URL } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { AppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { setBalance } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);
  const { roles, setRoles } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("Login.js: in useEffect user=" + userEmail);
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");
    const googlelogin = document.getElementById("googlelogin");

    if (userEmail) {
      logout.style.display = "inline";
      login.style.display = "none";
      googlelogin.style.display = "none";
      navigate("/Home");
    } else {
      console.log("User is not logged in");
      logout.style.display = "none";
      login.style.display = "inline";
      googlelogin.style.display = "inline";
    }
    /* const unsubscribe = auth.onAuthStateChanged( firebaseUser => {
            console.log('Login.js: in onAuthStateChanged'+firebaseUser);
            const login = document.getElementById('login');
            const logout = document.getElementById('logout');
            const register = document.getElementById('register');
    
            if(firebaseUser) {
                console.log("Valid User");
                setUser(firebaseUser);
               // logout.style.display = 'inline';
                //register.style.display = 'none';
                //login.style.display = 'none';
                navigate('/Home');
            }
            else {
                console.log('User is not logged in');
                logout.style.display = 'none';
                register.style.display = 'inline';
                login.style.display = 'inline';
            }
        }) */
    console.log("auth.currentuser=" + auth.currentUser);
  }, [userEmail]);

  /**Function to validate the input fields. If empty, it returns false */
  function validate(field, label) {
    if (!field) {
      setStatus("ERROR: " + label + " cannot be empty!");
      setTimeout(() => setStatus(""), 3000);
      return false;
    }
    return true;
  }

  /**Function to handleLogin button pressed. If fields are valid, it authenticates the user. */
  function handleLogin(e) {
    e.preventDefault();
    setStatus("");
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          "Login: User authenticated!!!" + JSON.stringify(userCredential.user)
        );
        setStatus("SUCCESS:User authenticated!");
        getUserAccount(userCredential.user);
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        setStatus("ERROR: " + error.message);
      });

    //Uncomment the following method to override firebase authentication and comment call to firebase above
    //overrideFirebase();
  }

  function handleGoogleLogin() {
    const googleProvider = new GoogleAuthProvider();

    // Sign in using a popup
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Get the Google access token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // Get signed-in user info
        const user = result.user;
        getUserAccount(user);
      })
      .catch((err) => {
        // Handle Errors here.
        const credential = GoogleAuthProvider.credentialFromError(err);
        console.log(
          "Error in Google login:",
          err.code,
          err.message,
          credential
        );
      });
  }

  //Method used only for testing to override firebase authentication.
  function overrideFirebase() {
    setUserEmail("preeti@gmail.com");
    setBalance(0);
    setStatus("SUCCESS:user authenticated!");
    getUserAccount({ email: "preeti@gmail.com" });
  }

  function getUserAccount(user) {
    (async () => {
      const { email } = user;
      try {
        console.log('SERVER_URL='+SERVER_URL);
        const url =  SERVER_URL +`/account/find/${email}`
        console.log('url==========='+url);
        let response = await fetch(
          url
        );
        let authenticatedUser = await response.json();
        console.log("response.json:", authenticatedUser);
        if (authenticatedUser) {
          setStatus("SUCCESS: User authenticated");
          setUserEmail(authenticatedUser[0].email);
          setBalance(authenticatedUser[0].balance);
          setHistory(authenticatedUser[0].history);
          setRoles(authenticatedUser[0].roles);
        } else {
          setStatus("ERROR: User not found");
          console.log("invalida user");
        }
      } catch (err) {
        console.log("in catch of getuseraccount" + err);
        setStatus("ERROR: No Account found for user in the banking system!");
      }
    })();
  }

  function handleLogout() {
    signOut(auth)
      .then(clearContext())
      .catch((error) => {
        console.log("error while logging out" + error.mesage);
        throw error;
      });
  }

  function clearContext() {
    setUserEmail(null);
    setStatus("SUCCESS: User Logged out successfully!");
  }

  function handleRegister(e) {
    e.preventDefault();
    setStatus("");
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login: User registered succesfully!!!");
        setStatus("SUCCESS:User registered succesfully!");
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        setStatus("ERROR:" + error.message);
      });
  }

  return (
    <div>
      <h1 className="title">MERN BANKING APP</h1>
      <Card
        bgcolor="warning"
        txtcolor="white"
        header="Login"
        status={status}
        body={
          <>
            <input
              type="input"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setStatus("");
                setEmail(e.currentTarget.value);
              }}
            />
            <br />
            Password
            <br />
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setStatus("");
                setPassword(e.currentTarget.value);
              }}
            />
            <br />
            <button
              type="submit"
              id="login"
              className="btn btn-light"
              onClick={handleLogin}
            >
              {" "}
              Login
            </button>
            <button
              type="button"
              id="googlelogin"
              className="btn btn-light"
              onClick={handleGoogleLogin}
            >
              {" "}
              Google Login
            </button>
            <button
              type="button"
              id="logout"
              className="btn btn-light"
              onClick={handleLogout}
            >
              {" "}
              Logout
            </button>
          </>
        }
      />
    </div>
  );
};

export default Login;
