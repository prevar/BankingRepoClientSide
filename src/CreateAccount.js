import React, { useState, useEffect, useContext } from "react";
import { AppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

function CreateAccount() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);

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

  function handle() {
    console.log(name, email, password);
    if (!validate(name, "Name")) return;
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return; 
   
    console.log('role is'+ role);
    const roles = [role];

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        const url = process.env.SERVER_URL+`/account/create/${name}/${email}/${userCredential.user.uid}/${roles}/${props.userEmail}/`;
        (async () => {
          var res = await fetch(url);
          var data = await res.json();
          console.log(data);
        })();
        console.log("Login: User created succesfully!!!");

        props.setStatus("SUCCESS:User created succesfully!");
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        props.setStatus("ERROR:" + error.message);
      });

    props.setShow(false);
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
