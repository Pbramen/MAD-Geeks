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
import {PerisitLogin} from './components/PersistLogin';

export function App({ }) {
    useEffect(() => {
        console.log("App mounted");
    }, []);

    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route path="login" element={ <SignInForm/>} />
                <Route path="register" element={<RegistrationPage />} />
                
                <Route element={<PerisitLogin/>}>
                <Route index path="home" element={<DashBoard/>} />
                <Route path="characters" element={<CharacterPage />} />
                <Route path="campagins" element={<CampaginPage/>} />
                </Route>


                {/* Testing pages */}
               
                <Route path="user" element={<AuthUsers/> } />
                <Route path="test" element={<GridPage/> } />
                
            </Route>
        </Routes>
    )
}

