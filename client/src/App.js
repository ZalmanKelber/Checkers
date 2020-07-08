import React from 'react';
import {BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/styles.css";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Logout from "./components/pages/Logout";
import Game from "./components/pages/Game";
import About from "./components/pages/About";
import Error from "./components/pages/Error";
import Statistics from "./components/pages/Statistics";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/login/:error" component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/game/:gameurl" component={Game} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/error/" exact component={Error} />
      <Route path="/error/:error" component={Error} />
      <Route path="/statistics" exact component={Statistics} />
      <Route path="/about" exact component={About} />
    </Router>
  );
}

export default App;
