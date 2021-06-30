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
import { updateAttendance } from '../middleware/attendance';
import { STATUS_LIST } from '../const';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
	attendances: state.AttendanceReducer.user_attendances
  }
}

const Attendance = (props) => {
  if(!props.login){
	return (<Redirect to="/login" />);
  }
  const dispatch = useDispatch();
  const [type, setType] = useState(0);
  const handleClickStatusUpdate = (t) => {
	dispatch(updateAttendance({
	  token: props.user.token,
	  type: t,
	}));
  }
  let nowStatus = props.user.status ?? 1;
  let status = 0;
  if(nowStatus === 1){
	status = 0;
  }else{
	status = 1;
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
				  onChange={(e) => setType(parseInt(e.target.value))}>
			{
			  STATUS_LIST.map((s, i) => {
				if(!(nowStatus === i)){
				  if(status === i){
					return (<option value={i} selected>{s}</option>);
				  }else{
					return (<option value={i}>{s}</option>);
				  }
				}else{
				  return (
					<p></p>
				  );
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
