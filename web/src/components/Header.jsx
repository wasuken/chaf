import { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

const mapStateToProps = (state) => {
  return {
	login: state.UserReducer.login,
	user: state.UserReducer.user,
  };
}

const Header = (props) => {
  const dispatch = useDispatch();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">{props.title}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {
              props.headers.map(h => (
                (<li class="nav-item">
				   {
					 h.onClick ?
					   (<a className="nav-link"
						   onClick={() => dispatch(h.onClick())}
						>
						  {h.name}
						</a>)
					   :
					   <Link className="nav-link" to={h.path}>{h.name}</Link>
				   }
                 </li>)
              ))
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default connect(mapStateToProps)(Header);
