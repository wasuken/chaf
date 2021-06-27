import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import store from '../store'

import { connect, useDispatch } from 'react-redux';

import Header from '../components/Header';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';

import logo from '../logo.svg';
import './App.css';

const handleClickLogout = () => {
  return function(dispatch){
	dispatch({
	  type: 'LOGOUT',
	  payload: '',
	})
  }
}

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
  };
}

function App(props){
  const headers = [
    {
      name: "Home",
      path: "/",
	  type: 'LOGIN',
    },
    {
      name: "Login",
      path: "/login",
	  type: 'LOGOUT',
    },
	{
      name: "profile",
      path: "/profile",
	  type: 'LOGIN',
    },
	{
	  name: "logout",
	  path: "/profile",
	  type: "LOGIN",
	  onClick: handleClickLogout
	}
  ];
  const atype = props.login ? 'LOGIN' : 'LOGOUT';
  const hs = headers.filter(h => {
	if(h.type === 'ALL' || h.type === atype){
	  return h;
	}
  })
  return (
    <Router>
      <div class="container">
        <Header headers={hs}/>

        <div class="main m-3 p-3">
		  <Switch>
			<Route exact path="/login">
              <Login />
			</Route>
			<Route exact path="/profile">
              <Profile />
			</Route>
			<Route exact path="/">
              <Home />
			</Route>
          </Switch>
		</div>
      </div>
    </Router>
  );
}

export default connect(mapStateToProps)(App);
