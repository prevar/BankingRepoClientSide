import React from "react";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import CreateAccount from "./CreateAccount";
import Logout from "./Logout";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Transfer from "./Transfer";
import AllData from "./AllData";
import { AppContext } from "./AppContext";
import { useState } from "react";

const AppRouter = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [roles, setRoles] = useState([]);

  console.log("roles are" + JSON.stringify(roles));
  const showCreateAccount = roles.includes("ADMIN")
    ? "bg-warning nav-btn show"
    : "hide";

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider
          value={{
            userEmail,
            setUserEmail,
            balance,
            setBalance,
            history,
            setHistory,
            roles,
            setRoles,
          }}
        >
          <div className="container center-text p-5">
            <div id="links" className={userEmail ? "show p-3" : "hide"}>
              <Link className="bg-warning nav-btn" to="/Home">
                Home
              </Link>
              <Link className={showCreateAccount} to="/CreateAccount">
                Create Account
              </Link>
              <Link className="bg-warning nav-btn" to="/Deposit">
                Deposit
              </Link>
              <Link className="bg-warning nav-btn" to="/Withdraw">
                Withdraw
              </Link>
              <Link className={showCreateAccount} to="/Transfer">
                Transfer
              </Link>
              <Link className="bg-warning nav-btn" to="/AllData">
                All Data
              </Link>
              <Link className="bg-warning nav-btn" to="/Logout">
                Logout
              </Link>
            </div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/CreateAccount" element={<CreateAccount />} />
              <Route path="/Deposit" element={<Deposit />} />
              <Route path="/Withdraw" element={<Withdraw />} />
              <Route path="/Transfer" element={<Transfer />} />
              <Route path="/AllData" element={<AllData />} />
              <Route path="/Logout" element={<Logout />} />
            </Routes>
          </div>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
