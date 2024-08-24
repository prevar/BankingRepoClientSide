import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, Card } from "./AppContext";
import { SERVER_URL } from "./firebaseConfig";

function Withdraw() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { balance, setBalance } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);

  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("CreateAccount: in useEffect: BEGIN");
    if (!userEmail) {
      navigate("/Login");
    }
  }, [userEmail, balance]);

  function onChangeWithdrawAmt(event) {
    setStatus("");
    const withdrawAmt = event.target.value;
    setWithdrawAmount(withdrawAmt);
    if (withdrawAmt.length > 0)
      document.getElementById("submitBtn").disabled = false;
  }

  function validateWithdrawAmt(withdrawAmt) {
    const floatAmt = parseFloat(withdrawAmt);
    if (isNaN(floatAmt)) {
      setStatus("Error: Withdraw Amount should be numeric");
      return false;
    }
    if (floatAmt <= 0) {
      setStatus("Error: Withdraw Amount should be greater than 0");
      return false;
    }
    if (parseFloat(balance) - floatAmt < 0) {
      setStatus(
        "Error: Withdraw Amount cannot be greater than the available funds"
      );
      return false;
    }
    return true;
  }

  async function withdraw() {
    setStatus("");
    if (validateWithdrawAmt(withdrawAmount)) {
      const newBalance = parseFloat(balance) - parseFloat(withdrawAmount);
      const result = await callWithdrawAmt(-parseFloat(withdrawAmount));
      if (result) {
        setBalance(result.balance);
        setHistory(result.history);
      }
      setStatus(
        `Success:$${withdrawAmount} withdrawn successfully in your account!`
      );
    } else {
      document.getElementById("withdrawAmount").value = "";
    }
  }

  async function callWithdrawAmt(withdrawnAmount) {
   const url =  SERVER_URL + `/account/updateBalance/${userEmail}/${withdrawnAmount}`
    let response = await fetch(
      url
    );
    let userAfterWithdraw = await response.json();
    return userAfterWithdraw;
  }

  return (
    <>
      <Card
        bgcolor="blue"
        txtcolor="black"
        header="Withdraw"
        body={
          <>
            <p>{status}</p>
            <p>Current Balance: {balance}</p>
            <label htmlFor="withdrawAmount">Deposit Amount</label>
            <input
              type="input"
              className="form-control"
              id="withdrawAmount"
              placeholder="Withdraw Amount"
              value={withdrawAmount}
              onChange={onChangeWithdrawAmt}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              id="submitBtn"
              disabled={withdrawAmount.length < 1}
              onClick={withdraw}
            >
              Withdraw
            </button>
          </>
        }
      />
    </>
  );
}

export default Withdraw;
