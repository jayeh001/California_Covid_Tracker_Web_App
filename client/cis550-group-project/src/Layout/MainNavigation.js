import { Link, useLocation } from 'react-router-dom';
import {useContext} from 'react';
import classes from './MainNavigation.module.css';


const MainNavigation = () => {


  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>COVID-19 Stats</div>
      </Link>
      <nav>
        <ul>
          {<li>
            <Link to="/">Home</Link>
          </li>}
          {<li>
            <Link to="/covid">Data</Link>
          </li>}
          {<li>
            <Link to="/covid-correlations">Correlations</Link>
          </li>}
          {<li>
            <Link to="/covid-timeline">Timeline</Link>
          </li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
