const initialState = {
  status: "",
  groups: [],
  users: [],
  user: {},
};

const BASE_URL = import.meta.env['BASE_URL'];

export const fetchList = (path, name) => {
  fetch(`${BASE_URL}${path}`)
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

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
  case 'RECEIVE_GROUPS':
    return {
      ...state,
      groups: action.payload
    };
  case 'RECEIVE_USERS':
    return {
      ...state,
      users: action.payload
    };
  case 'RECEIVE_USER':
    return {
      ...state,
      user: action.payload
    };
  default:
    return state;
  }
}
