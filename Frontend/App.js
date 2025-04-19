import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './About';     

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        {/* guys add other routes here if we need it */}
      </Routes>
    </Router>
  );
}

export default App;
