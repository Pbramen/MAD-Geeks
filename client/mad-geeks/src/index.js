import React from 'react';
import ReactDOM from 'react-dom/client';

import { router } from './router/customRouters'
import { BrowserRouter as Router, RouterProvider, createBrowserRouter} from 'react-router-dom';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>
);

