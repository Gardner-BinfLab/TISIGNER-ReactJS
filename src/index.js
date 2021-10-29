/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: index.js
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:41:17+13:00
 */



import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bulma/css/bulma.min.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.register();
