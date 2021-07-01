const initialState = {
  login: false,
  user: {
	name: '',
	token: '',
  },
  msg: '',
}

export default function UserReducer(state = initialState, action){
  switch(action.type){
  case 'RECEIVE_INFO':
	return {
	  ...state,
	  login: true,
	  user: action.payload,
	}
  case 'RECEIVE_INFO_INVALID':
	return {
	  ...initialState
	}
  case 'LOGOUT':
	localStorage.removeItem('auth');
	return {
	  ...initialState
	}
  case 'UPDATE_ATTENDANCE':
	let n = {
	  ...state,
	};
	n.user.status = action.payload.attendance_type;
	return n;
  case 'FAIL_UPDATE_ATTENDANCE':
  default:
    return state;
  }
}
