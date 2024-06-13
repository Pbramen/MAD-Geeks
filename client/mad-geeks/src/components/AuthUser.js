import {useEffect, useState} from 'react';
import axios from '../api/axios';

export const AuthUsers = ({})=> {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await axios.get('/api/clients/', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data)
            } catch (e) {
                console.log(e);
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
        </article>
    )
}