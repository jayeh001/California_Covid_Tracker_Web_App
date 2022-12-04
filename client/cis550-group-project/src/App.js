import './App.css';
import {
	Route,
	Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
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
