import { createBrowserRouter} from 'react-router-dom';

import App from '../App';
import { ErrorPage } from '../components/ErrorPage';
import { DashBoard } from '../components/DashBoard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }, 
  {
    path: '/home',
    element: <DashBoard />
  },
  {
    path: "*",
    element: <ErrorPage />
  }
])

