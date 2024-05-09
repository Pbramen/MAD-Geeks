import SignInForm from "./components/SignInForm";
import './assets/css/login.css';
import { Footer } from './components/Footer';
import { NavBar } from "./components/NavBar";
function App() {
  return (
    // wraps the entire application with router component
    <div className="flex-column full">
      <NavBar />
      <div className='mid'>
      <div className='centered'>
        <SignInForm />
      </div></div>
      <Footer className='footer'/>
    </div>
  );
}

export default App;
