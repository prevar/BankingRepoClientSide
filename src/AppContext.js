import React, { createContext, useState } from "react";

export const AppContext = createContext();

//Following values to be stored in the context so they are available throughout the app
export const AppProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [roles, setRoles] = useState([]);

  return (
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
      {children}
    </AppContext.Provider>
  );
};

//Card used by all js files to display on the screen
export function Card(props) {
  function classes() {
    const bg = props.bgcolor ? " bg-" + props.bgcolor : " ";
    const txt = props.txtcolor ? " text-" + props.txtcolor : " text-white";
    return "card mb-3" + bg + txt;
  }
  //Make the CSS class for to show color red in case of ERROR and green in case of SUCCESS
  const statusColor = props.status
    ? props.status.indexOf("ERROR") != -1
      ? "text-danger font-weight-bold"
      : props.status.indexOf("SUCCESS") != -1
      ? "text-success font-weight-bold"
      : ""
    : "";

  return (
    <div className={classes()} style={{ maxWidth: "38rem" }}>
      <div className="card-header">{props.header}</div>
      <div className="card-body">
        {props.status && (
          <div id="createStatus" className={statusColor}>
            {props.status}
          </div>
        )}
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
      </div>
    </div>
  );
}
