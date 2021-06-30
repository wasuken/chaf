import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import { connect } from 'react-redux';
import { handleLoginClick } from '../middleware/user';

import Header from '../components/Header';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
  }
}

const Login = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = props.login;
  if(props.login){
	return (<Redirect to="/" />);
  }
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
		<button class="btn btn-primary m-2" onClick={() => {
				  dispatch(handleLoginClick(email, password));
				  setEmail('');setPassword('');
				}}>
		  Login
		</button>
		<button class="btn btn-outline-primary m-2">
		  Signup
		</button>
	  </div>
    </div>
  );
};
export default connect(mapStateToProps)(Login);
