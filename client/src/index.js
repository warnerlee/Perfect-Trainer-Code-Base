import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

try {

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

} catch (error) {
  console.error('Failed to mount React application:', error);
  // Optionally add a visible error message to the DOM
  document.body.innerHTML = '<div style="color: red">React failed to load. Check console.</div>';
}