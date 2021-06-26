import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {
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
                <li class="nav-item">
                  <Link className="nav-link {h.active ? 'active' : ''}" to={h.path}>{h.name}</Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
