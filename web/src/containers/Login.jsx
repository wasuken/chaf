import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'

import Header from '../components/Header';

const fetchUserLogin = (email, password) => {
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

const handleLoginClick = (email, password) => {
  return function(dispatch) {
    return fetchUserLogin(email, password)
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
  };
};

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <p className="h3">
	    ログイン
	  </p>
	  <div className="input-group mb-3">
	    <span className="input-group-text" id="email">
	      メールアドレス
	    </span>
	    <input type="email"
	           value={email}
			   onChange={(e) => setEmail(e.target.value)}
	           className="form-control"
	           placeholder="メールアドレス"
	           aria-label="メールアドレス" />
	  </div>

	  <div className="input-group mb-3">
	    <span className="input-group-text" id="password">
	      パスワード
	    </span>
	    <input type="password"
			   value={password}
			   onChange={(e) => setPassword(e.target.value)}
	           placeholder="パスワード"
	           className="form-control" />
	  </div>
	  <div className="input-group mb-3">
		<button class="btn btn-primary m-2" onClick={() => dispatch(handleLoginClick(email, password))}>
		  Login
		</button>
		<button class="btn btn-outline-primary m-2">
		  Signup
		</button>
	  </div>
    </div>
  );
};
export default Login;
