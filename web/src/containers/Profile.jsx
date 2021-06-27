import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import store from '../store'
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
  }
}
const Profile = (props) => {
  if(!props.login){
	return (<Redirect to="/login" />);
  }
  return (
    <div class="container-fluid">
	  <h3 class="row">Profile</h3>
	  <div class="row">
		<div>
		  <span class="badge bg-primary">
			Name
		  </span>
		  {props.user.name}
		</div>
	  </div>
    </div>
  );
};

export default connect(mapStateToProps)(Profile);
