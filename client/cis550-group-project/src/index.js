import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import CovidPage from './pages/CovidPage';
import { BrowserRouter } from 'react-router-dom';

// import 'antd/dist/antd.css';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "shards-ui/dist/css/shards.min.css"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
          <App />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
