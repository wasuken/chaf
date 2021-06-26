import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from '../components/Header';
import Login from './Login';
import Home from './Login';

import logo from '../logo.svg';
import './App.css';

function App() {
  const headers = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Login",
      path: "/login",
    }
  ];
  return (
    <Router>
      <div>
        <Header headers={headers}/>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
