import { Outlet } from 'react-router-dom';
import './assets/css/login.css';
import { NavBarComp } from './components/NavBarComp';
import { Footer } from './components/Footer';
import { AuthProvider } from './components/context/AuthProvider';

function App() {
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
    <AuthProvider>
      <div className="flex-column full">
        <NavBarComp links={links} />
        <div className='mid flex-tripod-main'>
          <Outlet />
        </div>
        <Footer className='footer'/>
        </div>
      </AuthProvider>

  );
}

export default App;
