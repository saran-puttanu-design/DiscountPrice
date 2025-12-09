import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
}
