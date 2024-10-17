import React, { useState, useEffect, useContext } from "react";
import { AppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , SERVER_URL} from "./firebaseConfig";

//const bcrypt = require('bcryptjs');

function CreateAccount() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);
  const { roles, setRoles } = useContext(AppContext);

  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("CreateAccount: in useEffect: BEGIN");
    if (userEmail) {
      console.log("CreateAccount: in useEffect: in if authenticated");
    } else {
      navigate("/Login");
    }
  }, [userEmail, history]);

  return (
    <Card
      txtcolor="black"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm
            setShow={setShow}
            setStatus={setStatus}
            userEmail={userEmail}
            setHistory = {setHistory}
          />
        ) : (
          <CreateMsg setShow={setShow} />
        )
      }
    />
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = useState('USER');
  

  function validate(field, label) {
    console.log("in validate");
    if (!field) {
      props.setStatus("ERROR: " + label + " cannot be empty!");
      setTimeout(() => props.setStatus(""), 3000);
      return false;
    } else if (label === "Password" && field.length < 8) {
      props.setStatus("ERROR: Password has to be atleast 8 characters");
      setTimeout(() => props.setStatus(""), 3000);

      return false;
    }
    return true;
  }


   async function handle() {
    console.log(name, email, password);
    var data;
    if (!validate(name, "Name")) return;
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return; 
   
   /*  section can be used to encrypt password but in case of firebase, passwords are already encrypted so this is not needed.
   let hashedPasswd ;
    try {
      console.log('password='+password);
      hashedPasswd = await bcrypt.hash(password, 12);
      console.log('hashedPasswd='+hashedPasswd);
    }
    catch(err) {
      const error = new Error('coulnt create hashed passwd and user', 500);
      console.log('err='+err);
    } 

     createUserWithEmailAndPassword(auth, email, hashedPasswd) */
    try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     const updUserHistory = await createUser(userCredential.user.uid);
     props.setHistory(updUserHistory.history);
     props.setStatus("SUCCESS:User created succesfully!");
    }
    catch(err) {
      props.setStatus('Encountered error while creating user '+err);
    }
    props.setShow(false);
  }


  async function createUser(uid) {
    const url = SERVER_URL +`/account/create`;

    //create user JSON object to send in the body of POST request
    const user = {
                  name: name,
                  email: email,
                  uid: uid,
                  roles: role, 
                  userEmail: props.userEmail}
       
    //Make a POST request to create user
    console.log('user to be sent to fetch post'+JSON.stringify(user));
        
    var res = await fetch(url,  { method:'POST', 
                                  body: JSON.stringify({ "user": user }),
                                   headers: {
                                      'Accept': 'application/json',
                                      'Content-Type': 'application/json',
                                    },
                                 } );

    var data = await res.json();

    console.log('data is '+data);
    return await data;

  }

  return (
    <>
      Name
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <br />
      Email address
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      <select
        id="role"
        className="form-select"
        onChange={(e) => setRole(e.target.options[e.target.selectedIndex].id)}
      >
        <option key="USER" id="USER">
          USER
        </option>
        <option key="ADMIN" id="ADMIN">
          ADMIN
        </option>
      </select>
      <button type="submit" className="btn btn-light" onClick={handle}>
        Create Account
      </button>
    </>
  );
}

export default CreateAccount;
