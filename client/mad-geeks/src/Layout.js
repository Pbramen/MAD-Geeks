import { Outlet } from 'react-router-dom';
import { NavBarComp } from './components/NavBarComp';

import { AuthProvider } from 'components/context/AuthProvider';

export const Layout = () =>{

  const links = [
    {
      path: 'home',
      name: 'Home'
    },
    {
      path: 'campagins',
      name: 'Campagins'
    },
    {
      path: 'characters',
      name: 'Characters'
    },
    {
      path: 'login',
      name: 'Account'
    },
  ]

  return (
    <div className="flex-column">
      <NavBarComp links={links} />
      <div className='mid flex-tripod-main'>
      <AuthProvider>
          <Outlet />
      </AuthProvider>
      </div>
      </div>
  );
}