import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Dataprovider from './context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dataprovider>
      <App />
    </Dataprovider>

  </React.StrictMode>
);

