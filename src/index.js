import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

async function test() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("poczekało");
}

test();

ReactDOM.render(<App />, document.getElementById("root"));
