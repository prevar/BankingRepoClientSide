import React from "react";
import { AppContext, Card } from "./AppContext";
import { useContext } from "react";

function Home() {
  const { userEmail } = useContext(AppContext);
  const { roles } = useContext(AppContext);

  const isAdminMsg = roles.includes("ADMIN")
    ? "You are an Administrator"
    : "You are an Account Holder";

  let emailToShow = "";
  if (userEmail) {
    emailToShow = userEmail;
  }
  const title = `Welcome to the bank ${emailToShow}`;
  return (
    <>
      {
        <Card
          bgcolor="warning"
          txtcolor="white"
          header="BadBank Landing Page"
          title={title}
          text={isAdminMsg}
          body={<img src="bank.jpg" className="img-fluid" alt="Bank" />}
        />
      }
    </>
  );
}

export default Home;
