import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Stock from './pages/Stock';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/stock/:symbol" component={Stock} />
        <Route path="/portfolio" component={Portfolio} /> */}
      </Switch>
    </Router>
  );
}

export default App;