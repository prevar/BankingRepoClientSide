import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, Card } from "./AppContext";
import { auth } from "./firebaseConfig";

const Logout = () => {
  console.log("loading logout");
  const { userEmail, setUserEmail } = useContext(AppContext);
  const navigate = useNavigate();

  auth
    .signOut()
    .then(console.log("setting user to null"))
    .then(setUserEmail(null))
    .catch((error) => {
      console.log("error while logging out" + error.mesage);
    });

  function loginAgain() {
    navigate("/Login");
  }

  return (
    <>
      <Card
        bgcolor="blue"
        txtcolor="black"
        header="Signed out"
        body={
          <>
            <p>
              {" "}
              You have succesfully logged out of the Banking System. Please go
              to Login page to log back in if needed.
            </p>
            <button
              type="submit"
              className="btn btn-light"
              id="loginAgain"
              onClick={loginAgain}
            >
              Login again
            </button>
          </>
        }
      />
    </>
  );
};
export default Logout;
