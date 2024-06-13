import { createBrowserRouter} from 'react-router-dom';

import App from '../App';
import { ErrorPage } from '../components/ErrorPage';
import { DashBoard } from '../components/DashBoard';
import SignInForm from '../components/SignInForm';
import { CampaginPage } from '../components/CampaignPage';
import { CharacterPage } from '../components/CharacterPage';
import { GridPage } from '../components/GridPage';
import { RegistrationPage } from '../components/RegistrationPage';
import { AuthUsers } from '../components/AuthUser';

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
      },
      {
        path: 'test',
        element: <GridPage />,
        errorElement: <ErrorPage />
      },
      {
        path: 'register',
        element: <RegistrationPage />,
        errorElement: <ErrorPage />
      },
      {
        path: 'users',
        element: <AuthUsers />,
        errorElement: <ErrorPage />
      }] 
  }
])

