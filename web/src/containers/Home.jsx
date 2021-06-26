import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from '../components/Header';

const Home = () => {
  return (
    <div>
	  <Route exact path="/">
		{
		  if(!loggedIn){
			return <Redirect to="/login" />;
		  }
		}
	  </Route>
    </div>
  );
};

export default Home;
