const initialState = {
  status: "",
  group_attendances: [],
  user_attendances: {},
};
const BASE_URL = import.meta.env['BASE_URL'];

export const fetchList = (path, name, token) => {
  return function(dispatch){
	fetch(`${BASE_URL}${path}?token=${token}`)
	  .then(res => res.json())
	  .then(json => {
		console.log(json);
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
		console.log(json);
		if(json.status >= 200 && json.status <= 299){
		  dispatch({
			type: `RECEIVE_${name}`,
			paload: json.data,
		  });
		}
	  })
	  .catch(error => dispatch({
		type: `FAIL_RECEIVE_${name}`,
		error: error.msg,
		payload: null,
	  }));
  }
}

export default function AttendanceReducer(state = initialState, action) {
  switch (action.type) {
  case 'RECEIVE_GROUP_ATTENDANCES':
    return {
      ...state,
      group_attendances: action.payload
    };
  case 'RECEIVE_USER_ATTENDANCES':
    return {
      ...state,
      user_attendances: action.payload
    };
  case 'FAIL_RECEIVE_GROUP_ATTENDANCES':
    return {
      ...state,
      group_attendances: action.payload
    };
  case 'FAIL_RECEIVE_USER_ATTENDANCES':
    return {
      ...state,
      user_attendances: action.payload
    };
  default:
    return state;
  }
}
