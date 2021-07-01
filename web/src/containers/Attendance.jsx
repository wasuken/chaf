import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import store from '../store'
import { connect, useDispatch } from 'react-redux';
import { fetchList, updateAttendance } from '../middleware/attendance';
import { fetchUserDispatch } from '../middleware/user';
import { STATUS_LIST } from '../const';

const mapStateToProps = (state) => {
  const nu = {
	...state.UserReducer.user,
  }
  return {
	login: state.UserReducer.login,
	user: nu,
	attendances: state.AttendanceReducer.user_attendances
  }
}

const Attendance = (props) => {
  if(!props.login){
	return (<Redirect to="/login" />);
  }
  const dispatch = useDispatch();
  let initStatus = props.user.status === 0 ? 1 : 0 ;
  const [type, setType] = useState(initStatus);
  const handleClickStatusUpdate = (t) => {
	dispatch(updateAttendance({
	  token: props.user.token,
	  type: t,
	}));
	dispatch(fetchList('api/user/attendances', 'USER_ATTENDANCES', props.user.token))
	dispatch(fetchUserDispatch(props.user.token));
  }
  return (
    <div className="container-fluid">
	  <h3 className="row">勤怠</h3>
	  <div className="row">
		<div>
		  <span className="badge bg-primary">
			Name
		  </span>
		  {props.user.name}
		</div>
	  </div>
	  <div className="row">
		<div className="input-group">
          <span className="input-group-text">
			仕事状態
		  </span>
		  <select className="form-select"
				  onChange={(e) => setType(e.target.value)}>
			{
			  STATUS_LIST.map((s, i) => {
				if(props.user.status !== i){
				  return (<option value={i} key={i}>{s}</option>);
				}
			  })
			}
		  </select>
		  <button onClick={() => handleClickStatusUpdate(type)} class="btn btn-outline-primary">更新</button>
		</div>

	  </div>
	  <div className="row">
		状態: {STATUS_LIST[props.user.status]}
	  </div>
    </div>
  );
};

export default connect(mapStateToProps)(Attendance);
