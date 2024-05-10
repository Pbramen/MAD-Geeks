import { createBrowserRouter} from 'react-router-dom';

import App from '../App';
import { ErrorPage } from '../components/ErrorPage';
import { DashBoard } from '../components/DashBoard';
import SignInForm from '../components/SignInForm';
import { CampaginPage } from '../components/CampaignPage';
import { CharacterPage } from '../components/CharacterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'home',
        element: <DashBoard />,
        errorElement: <ErrorPage />
      },
      {
        path: 'login',
        element: <SignInForm />,
        errorElement: <ErrorPage />
      },
      {
        path: 'campagins',
        element: <CampaginPage />,
        errorElement: <ErrorPage />
      },
      {
        path: 'characters',
        element: <CharacterPage />,
        errorElement: <ErrorPage />
      }
      ] 
  }, 
])

