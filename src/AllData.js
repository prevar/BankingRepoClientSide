import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, Card } from "./AppContext";

function AllData() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { balance, setBalance } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);

  const navigate = useNavigate();

  //If userEmail or history changes, re-render the page
  useEffect(() => {
    //If userEmail doesnt exist, redirect to Login page
    if (!userEmail) {
      navigate("/Login");
    }
  }, [userEmail, history]);

  return (
    <>
      {history != null && history.length > 0 && (
        <Card
          bgcolor="white"
          txtcolor="black"
          header="All Transactions"
          title={`Current Balance is  ${balance}`}
          body={
            <>
              <div className="m-3">
                <div key="gridHeader" className="row border border-warning">
                  <div className="col-sm">TRANSACTION NO.</div>
                  <div className="col-sm">TRANSACTION TYPE</div>
                  <div className="col-sm">TRANSACTION DETAILS</div>
                </div>
                {history.map((transaction, index) => (
                  <div key={index} className="row border border-warning">
                    <div className="col-sm">{index}</div>
                    <div className="col-sm">{transaction.operation}</div>
                    <div className="col-sm">{transaction.operand}</div>
                  </div>
                ))}
              </div>
            </>
          }
        />
      )}
    </>
  );
}

export default AllData;
