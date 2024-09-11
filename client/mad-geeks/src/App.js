import { Routes, Route } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { DashBoard } from './components/DashBoard';
import SignInForm from './components/SignInForm';
import { CampaginPage } from './components/CampaignPage';
import { CharacterPage } from './components/CharacterSheet/CharacterPage';
import { GridPage } from './components/GridPage';
import { RegistrationPage } from './components/RegistrationPage';
import { AuthUsers } from './components/AuthUser';

import { Layout } from './Layout';
import { PerisitLogin } from './components/PersistLogin';

import { PageSheetProvider } from 'components/context/PageSheetProvider';
import { CreateCharacter } from 'components/CharacterSheet/CreateCharacter';

import { ErrorSheetProvider } from 'components/CharacterSheet/ErrorProvider';
import { MapLayout } from 'components/Geolocation/MapLayout';
export function App({ }) {


    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route path="login" element={ <SignInForm/>} />
                <Route path="register" element={<RegistrationPage />} />
                
                {/* <Route element={<PerisitLogin/>}> */}
                    {/*<Route index path="home" element={<DashBoard />} /> */}
                    <Route path="characters" element={<CharacterPage />} />
                    <Route path="campagins" element={<CampaginPage />} />
                    <Route path="" element={<ErrorSheetProvider />}>
                        <Route path="" element={<PageSheetProvider />}>
                            <Route path="new-character" element={<CreateCharacter />} />
                        </Route>
                    </Route>
                    {/*Testing page here..*/}
                    <Route path="home" element={<AuthUsers/> } />
                </Route>


                {/* Testing pages */}
                <Route path="map" element={<MapLayout />} />
                <Route path="test" element={<GridPage/> } />
                
            {/* </Route> */}
        </Routes>
    )
}

