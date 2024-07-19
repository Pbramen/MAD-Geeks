import { Outlet } from 'react-router-dom';
import './assets/css/login.css';
import { NavBarComp } from './components/NavBarComp';
import { Footer } from './components/Footer';
import { useEffect } from 'react';
import { AuthProvider } from 'components/context/AuthProvider';

export const Layout = () =>{
  useEffect(() => {
    console.log("Layout mounted")
  }, []);

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
    <div className="flex-column full">
      <NavBarComp links={links} />
      <div className='mid flex-tripod-main'>
      <AuthProvider>
          <Outlet />
      </AuthProvider>
      </div>
      <Footer className='footer'/>
      </div>
  );
}