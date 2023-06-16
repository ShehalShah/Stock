import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Stock from './pages/Stock';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
      <Route element={<Home />} exact path="/" />
      <Route element={<Stock />} exact path="/stock/:symbol" />
      <Route element={<Auth />} exact path="/auth" />
      <Route element={<Portfolio />} exact path="/portfolio" />
      </Routes>
    </Router>
  );
}

export default App;