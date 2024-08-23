import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './modules/users/context/AuthContext';
/*
  Bootstrap configuration
*/
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
/*
  Bootstrap icons configuration
*/
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
/*
  React toastify configuration
*/
import '../node_modules/react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
