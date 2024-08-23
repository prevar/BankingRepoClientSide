import React, { useEffect, useContext, useState } from "react";
import { AppContext, Card } from "./AppContext";

function Transfer() {
  const { userEmail, setUserEmail } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext);

  const [transferAmount, setTransferAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [fromUserEmail, setFromUserEmail] = useState(null);
  const [toUserEmail, setToUserEmail] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function findAllUsers() {
      let response = await fetch(`http://localhost:3001/account/findAll`);
      let data = await response.json();
      setUsers(data);
    }
    findAllUsers();
  }, []);

  async function transfer() {
    validateTransfer();
    let userAfterTransfer = await callTransferAmt();
    setHistory(userAfterTransfer.history);
    clearFields();
  }

  //Needs to be implemented to check if sufficient funds are available etc.
  function validateTransfer() {
    return true;
  }
  async function callTransferAmt() {
    let response = await fetch(
      `http://localhost:3001/account/transfer/${userEmail}/${fromUserEmail}/${toUserEmail}/${transferAmount}`
    );
    if (response.status == 200) {
      setStatus("SUCCESS: Amount Transferred successfully");
    } else {
      setStatus(JSON.stringify(response));
    }
    let userAfterTransfer = response.json();
    return userAfterTransfer;
  }

  function clearFields() {
    document.getElementById("transferAmount").value = 0;
    document.getElementById("from").options[0].selected = "selected";
    document.getElementById("to").options[0].selected = "selected";
  }
  return (
    <>
      <Card
        bgcolor="blue"
        txtcolor="black"
        header="Transfer"
        status={status}
        body={
          <>
            <div className="container">
              <div className="row">
                <div className="col">
                  <label>From User</label>
                </div>
                <div className="col">
                  <select
                    id="from"
                    className="form-select"
                    onChange={(e) =>
                      setFromUserEmail(
                        e.target.options[e.target.selectedIndex].id
                      )
                    }
                  >
                    {users.map((user) => (
                      <option key={`from_${user._id}`} id={user.email}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row" id="toAccount">
                <div className="col">
                  <label>To User</label>
                </div>
                <div className="col">
                  <select
                    id="to"
                    className="form-select"
                    onChange={(e) =>
                      setToUserEmail(
                        e.target.options[e.target.selectedIndex].id
                      )
                    }
                  >
                    {users.map((user) => (
                      <option key={`to_${user._id}`} id={user.email}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row" id="amt">
                <div className="col">
                  <label>Amount to Transfer</label>
                </div>
                <div className="col">
                  <input
                    type="input"
                    className="form-control"
                    id="transferAmount"
                    placeholder="Transfer Amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.currentTarget.value)}
                  />
                  <br />
                </div>
              </div>
            </div>
            <br />
            <button
              type="submit"
              className="btn btn-light"
              id="submitBtn"
              onClick={transfer}
            >
              Complete Transfer
            </button>
          </>
        }
      />
    </>
  );
}

export default Transfer;
