import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Arandur from './pages/Arandur';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arandur" element={<Arandur />} />
      </Routes>
    </Router>
  );
}

export default App;
