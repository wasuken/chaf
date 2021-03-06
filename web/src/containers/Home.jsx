import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

import Header from '../components/Header';
import store from '../store'

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
  }
}

const Home = (props) => {
  if(!props.login){
	return (<Redirect to="/login" />);
  }
  return (
    <div>
	  <div>
		Home
	  </div>
    </div>
  );
};

export default connect(mapStateToProps)(Home);
