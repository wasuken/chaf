import { useState, useEffect } from 'react';
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
import Attendance from './Attendance';

import { fetchUserDispatch } from '../middleware/user';

import { HEADERS } from '../const';

import logo from '../logo.svg';
import './App.css';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
  };
}

function App(props){
  const dispatch = useDispatch();
  useEffect(() => {
	const auth = localStorage.getItem('auth');
	if(auth !== undefined){
	  const authj = JSON.parse(auth);
	  dispatch({
		type: 'RECEIVE_INFO',
		payload: authj,
	  });
	  dispatch(fetchUserDispatch(authj.token))
	}
  }, []);
  const atype = props.login ? 'LOGIN' : 'LOGOUT';
  const hs = HEADERS.filter(h => {
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
			<Route exact path="/attendance">
              <Attendance />
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
