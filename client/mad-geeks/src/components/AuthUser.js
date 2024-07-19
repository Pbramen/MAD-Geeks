import { useEffect, useState } from 'react';
import { useAxiosP } from '../hooks/useAxiosP';
import { useRefresh } from '../hooks/useRefresh';
import { useAuth } from 'hooks/useAuth';
/**
 * @returns {JSX.Element} Admin user page list
 */
export const AuthUsers = ({ }) => {
    const [users, setUsers] = useState([]);
    const axios = useAxiosP(); 
    const refresh = useRefresh();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            console.log('attempting to grab...')
            try {
                console.log("auth is set to ", auth?.accessToken);
                const response = await axios.get('/api/clients/', {
                    signal: controller.signal
                });
                isMounted && response?.data && setUsers(response.data)
            } catch (e) {
                console.log("Unepected error: " +  e.message);
                //redirect to login screen.
            }
        }

        getUser();
        return (() => {
            isMounted = false;
            controller.abort()
        })
    }, [])

    return (
        <article>
            <h2>Logged in Users</h2>
            { users?.length ?
                <ul>
                    {users.map((e, index) => {
                        return (
                            <li key={index}>{e.userLogin}</li>
                        )
                    }) }
                </ul>
                : <p>No Users to display</p>
            }
            <button onClick={()=>{refresh()}}>Refresh</button>
        </article>
    )
}