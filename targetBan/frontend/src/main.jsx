import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './css/index.css';
import App from './App.jsx';
import JoinRoom from './JoinRoom.jsx';
import CreateRoom from './CreateRoom.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/draft/:roomId" element={<JoinRoom />} />
        <Route path="/draft/:roomId/:team" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
