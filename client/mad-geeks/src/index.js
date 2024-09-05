
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthProvider';
import {App} from './App';
// import './assets/css/animations.css'
// import './assets/css/index.css'
// import './assets/css/login.css'
// import './assets/css/error.css'
// import './assets/css/font.css'
// import './assets/css/nav.css'
// import './assets/css/form.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </Router>

  );

