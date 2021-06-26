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
	return {
	  ...initialState
	}
  default:
    return state;
  }
}
