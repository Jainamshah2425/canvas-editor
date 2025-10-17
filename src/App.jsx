// Main App Component
// Sets up routing for the entire application

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CanvasEditor from './pages/CanvasEditor';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page - landing page with "Create New Canvas" button */}
        <Route path="/" element={<Home />} />
        
        {/* Canvas Editor - main editor page with canvasId from URL */}
        <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
