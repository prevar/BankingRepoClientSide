import React, { useEffect, useContext, useState } from "react";
import { AppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./firebaseConfig";

function Deposit() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { balance, setBalance } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);

  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState("");
  const [status, setStatus] = useState("");

  //Redirect to login page if no userEmail. Also reload page if balance or logged in user email changes.
  useEffect(() => {
    if (!userEmail) {
      navigate("/Login");
    }
  }, [userEmail, balance]);

  function onChangeDepositAmt(event) {
    setStatus("");
    const depAmt = event.target.value;
    setDepositAmount(depAmt);
    if (depAmt.length > 0)
      document.getElementById("submitBtn").disabled = false;
  }

  function validateDepositAmt() {
    const floatAmt = parseFloat(depositAmount);
    if (isNaN(floatAmt)) {
      setStatus("Error: Deposit Amount should be numeric");
      return false;
    }
    if (floatAmt <= 0) {
      setStatus("Error: Deposit Amount should be greater than 0");
      return false;
    }
    return true;
  }

  async function deposit() {
    setStatus("");
    if (validateDepositAmt(depositAmount)) {
      const newBalance = parseFloat(balance) + parseFloat(depositAmount);
      const result = await callDepositAmt(depositAmount);
      if (result) {
        setBalance(result.balance);
        setHistory(result.history);
      }
      setStatus(
        `Success:$${depositAmount} deposited successfully in your account!`
      );
    } else {
      //Clear value of depositAmt f+if its invalid.
      document.getElementById("depositAmount").value = "";
    }
  }

  async function callDepositAmt(addedAmount) {
    const url =  SERVER_URL +`/account/updateBalance/${userEmail}/${addedAmount}`; 
    let response = await fetch(
      url
    );
    let userAfterDeposit = await response.json();
    //console.log('callDepositAmt end - userAfterDeposit='+JSON.stringify(userAfterDeposit));
    return userAfterDeposit;
  }

  return (
    <>
      <Card
        bgcolor="blue"
        txtcolor="black"
        header="Deposit"
        body={
          <>
            {status}
            <p>Current Balance: {balance}</p>
            <label htmlFor="depositAmount">Deposit Amount</label>
            <input
              type="input"
              className="form-control"
              id="depositAmount"
              placeholder="Deposit Amount"
              value={depositAmount}
              onChange={onChangeDepositAmt}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              id="submitBtn"
              disabled={depositAmount.length < 1}
              onClick={deposit}
            >
              Deposit
            </button>
          </>
        }
      />
    </>
  );
}

export default Deposit;
