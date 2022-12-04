import logo from './logo.svg';
import './App.css';
import {
	Route,
	Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Layout from './Layout/Layout';
import CovidPage from './pages/CovidPage';
import CovidCorrelations from './pages/CovidCorrelationsPage';
import CovidTimeline from './pages/CovidTimeline';

function App() {
  return (
    <Layout>
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
      <Route path="/covid-correlations"
            render={() => (
              <CovidCorrelations />
          )} />
        <Route path="/covid-timeline"
            render={() => (
              <CovidTimeline />
            )}/>
  </Switch> 
    </Layout>
    
  );
}

export default App;
