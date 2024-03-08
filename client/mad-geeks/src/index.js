import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorPage } from './components/ErrorPage';
import { DashBoard } from './components/DashBoard';
import { BrowserRouter as Router, RouterProvider, createBrowserRouter} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }, 
  {
    path: '/home',
    element: <DashBoard />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>
);

