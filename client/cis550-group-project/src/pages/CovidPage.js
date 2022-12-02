import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import CovidPage from './pages/CovidPage';
//import CorrelationPage from './pages/CorrelationPage';
//import TimelinePage from './pages/TimelinePage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/covid"
							render={() => (
								<CovidPage />
							)}/>
		<Route path="/covid/:type"
							render={() => (
								<CovidPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

