import React, { useState } from "react";

// this is a test login form
export default function App() {
  const [action, setFormAction] = useState("Login");

  const switchAction = () => {
    setFormAction(prevAction =>
      prevAction === "Login" ? "Register" : "Login"
    );
  };

  return (
    <div className="container">
      <form action={`/${action.toLowerCase()}`} method="post">
        <input type="text" name="username" />
        <input type="text" name="password" />
        <button type="submit">Submit</button>
      </form>
      <button onClick={switchAction}>{action}</button>>
    </div>
  );
}
