import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import store from '../store'
import { connect, useDispatch } from 'react-redux';

import { fetchList } from '../middleware/attendance';

import { STATUS_LIST } from '../const';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
	attendances: state.AttendanceReducer.user_attendances,
  }
}

const Profile = (props) => {
  const dispatch = useDispatch();
  dispatch(fetchList('api/user/attendances', 'USER_ATTENDANCES', props.user.token));
  let status = STATUS_LIST[props.user.status] ?? '退勤';
  if(!props.login){
	return (<Redirect to="/login" />);
  }
  return (
    <div class="container-fluid">
	  <h3 class="row">Profile</h3>
	  <div class="row">
		<div>
		  <span class="badge bg-success">
			Name
		  </span>
		  {props.user.name}
		</div>
	  </div>
	  <div class="row">
		<div>
		  <span class="badge bg-primary">
			Status
		  </span>
		  {status}
		</div>
	  </div>
    </div>
  );
};

export default connect(mapStateToProps)(Profile);
