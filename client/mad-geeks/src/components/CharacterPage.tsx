import React, {useState, useEffect} from 'react';
import { useNetworkChecker } from 'hooks/useNetworkChecker';
import { CardTwo } from './CardTwo';
import { AxiosResponse } from 'axios';

export function CharacterPage() {
    const axios = useNetworkChecker();
    const [sheets, setSheets] = useState<any[]>([0, 0, 0, 0, 0, 0, 0, 0, 0,]);

    useEffect(() => {
        const control = new AbortController();
        const getAllCharacters = async () => {
            await axios.get("http://localhost:4000/api/clients/character_sheet", { signal: control.signal, withCredentials: true })
                .then((res: AxiosResponse) => {
                    if (res.status === 200 && res.data) {
                        const list = res.data.sheets as any[]; // oh boy this is a large type
                        setSheets(list);
                    }
                    // setSheets()
                }).catch((error) => {
                    console.log("ERR:", error);
                })
        }
        getAllCharacters();
        return (() => { control.abort() })
    }, [])
    return (
        <React.Fragment>
            {/* display all current character sheets */}
            {/* create new  */ }
            <ul className="stretch grid three_by_three no-decor">
                {sheets.map((e) => {
                    if (e === 0)
                        return <CardTwo empty={true}></CardTwo>
                    return <CardTwo empty={false}></CardTwo>
                })}
            </ul>
        </React.Fragment>
    )
}