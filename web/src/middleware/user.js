export const handleLogoutClick = () => {
  return function(dispatch){
	dispatch({
	  type: 'LOGOUT',
	  payload: '',
	})
  }
}

export const fetchUserLogin = (email, password) => {
  const params = {
	email: email,
	password: password,
  };
  const esc = encodeURIComponent;
  const query = Object.keys(params)
		.map(k => esc(k) + '=' + esc(params[k]))
		.join('&');
  return fetch(`${import.meta.env.BASE_URL}api/user?${query}`);
}

export const handleLoginClick = (email, password) => {
  return function(dispatch) {
    return fetchUserLogin(email, password)
	  .then((res) => res.json())
	  .then(
		(json) => {
		  if(json.status > 199 && json.status < 300){
			localStorage.setItem('auth', JSON.stringify(json.data));
			dispatch({
			  type: 'RECEIVE_INFO',
			  payload: json.data,
			});
		  }else{
			dispatch({
			  type: 'RECEIVE_INFO_INVALID',
			  payload: 'Error',
			})
		  }
		},
		(error) => dispatch({
		  type: 'RECEIVE_INFO_INVALID',
		  payload: 'Error'
		}),
      );
  };
};

export const fetchUser = (token) => {
  const params = {
	token: token,
  };
  const esc = encodeURIComponent;
  const query = Object.keys(params)
		.map(k => esc(k) + '=' + esc(params[k]))
		.join('&');
  return fetch(`${import.meta.env.BASE_URL}api/user?${query}`);
}
export const fetchUserDispatch = (token) => {
  return (dispatch) => {
	return fetchUser(token)
	  .then((res) => res.json())
	  .then(
		(json) => {
		  if(json.status > 199 && json.status < 300){
			dispatch({
			  type: 'RECEIVE_INFO',
			  payload: json.data,
			});
		  }else{
			dispatch({
			  type: 'RECEIVE_INFO_INVALID',
			  payload: 'Error',
			})
		  }
		},
		(error) => dispatch({
		  type: 'RECEIVE_INFO_INVALID',
		  payload: 'Error'
		}),
	  );
  }
};
