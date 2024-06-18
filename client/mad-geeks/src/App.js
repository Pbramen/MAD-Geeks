import { Routes, Route } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { DashBoard } from './components/DashBoard';
import SignInForm from './components/SignInForm';
import { CampaginPage } from './components/CampaignPage';
import { CharacterPage } from './components/CharacterPage';
import { GridPage } from './components/GridPage';
import { RegistrationPage } from './components/RegistrationPage';
import { AuthUsers } from './components/AuthUser';
import { useEffect } from 'react';
import { Layout } from './Layout';

export function App({ }) {
    useEffect(() => {
        console.log("App mounted");
    }, []);

    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index path="home" element={<DashBoard/>} />
                <Route path="campagins" element={<CampaginPage/>} />
                <Route path="login" element={ <SignInForm/>} />
                <Route path="register" element={<RegistrationPage/> } />
                <Route path="characters" element={<CharacterPage />} />
                
                {/* Testing pages */}
                <Route path="user" element={<AuthUsers/> } />
                <Route path="test" element={<GridPage/> } />
            </Route>
        </Routes>
    )
}

