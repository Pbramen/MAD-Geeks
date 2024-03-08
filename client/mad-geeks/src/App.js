import SignInForm from "./components/SignInForm";
import HomeBanner from "./components/HomeBanner";
import './assets/css/login.css';
function App() {
  return (
    <main className='grid-container'>
        <HomeBanner />
        <SignInForm />
        
    </main>
  );
}

export default App;
