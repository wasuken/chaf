import { BASE_URL } from '../const';
import { fetchUser } from './user'
export const fetchList = (path, name, token) => {
  return function(dispatch){
	fetch(`${BASE_URL}${path}?token=${token}`)
	  .then(res => res.json())
	  .then(json => {
		if(json.status >= 200 && json.status <= 299){
		  dispatch({
			type: `RECEIVE_${name}`,
			paload: json.data,
		  });
		}
	  })
	  .catch(error => dispatch({
		type: `FAIL_RECEIVE_${name}`,
		error: true,
		payload: error,
	  }));
  }
}

export const updateAttendance = (params) => {
  return function(dispatch){
	const body = Object.keys(params).reduce((o,key)=>(o.set(key, params[key]), o), new FormData());
	fetch(`${BASE_URL}api/user/attendance`, {
	  method: 'POST',
	  body: body
	})
	  .then(res => res.json())
	  .then(json => {
		if(json.status >= 200 && json.status <= 299){
		  dispatch({
			type: `UPDATE_ATTENDANCE`,
			paload: json.data,
		  });
		}
	  })
	  .catch(error => dispatch({
		type: `FAIL_UPDATE_ATTENDANCE`,
		error: error.msg,
		payload: null,
	  }));
	// return Promise.all([
	//   dispatch(fetchList('api/user/attendances', 'USER_ATTENDANCES', params.token)),
	//   dispatch(fetchUser(params.token)),
	// ]).then(r =>{
	//   return dispatch({
	// 	type: 'UPDATE_ATTENDANCE'
	//   })
	// })
	//   .catch(e => {
	// 	return dispatch({
	// 	  type: 'FAIL_UPDATE_ATTENDANCE'
	// 	})
	//   })
  }
}
