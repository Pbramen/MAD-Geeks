import React, {useState, useEffect} from 'react';
import axios from '../../api/axios';
import { CardTwo } from '../CardTwo';
import { AxiosResponse } from 'axios';
import { TitleHeader } from '../TitleHeader';
import { BannerMenu, listObject } from '../BannerMenu';

export function CharacterPage() {
    const [sheets, setSheets] = useState<any[]>([0, 0, 0, 0, 0, 0, 0, 0, 0,]);
    var items = [];
    const subBanner: listObject[] = [
        { value: "Search", input: true, id: "search-bar" },
        { value: "Filter" },
        { value: "+ Add", linkTo: "/new-character?page=0" },
        { value: "- Remove" }
    ]
    useEffect(() => {
        const control = new AbortController();
        const getAllCharacters = async () => {
            await axios.get("http://localhost:4000/api/clients/character_sheet", { signal: control.signal, withCredentials: true })
                .then((res: AxiosResponse) => {
                    if (res.status === 200 && res.data) {
                        const list = res.data.sheets as any[]; // oh boy this is a large type
                    }
                    // setSheets()
                }).catch((error) => {
                    //console.log("ERR:", error);
                })
        }
        getAllCharacters();
        return (() => { control.abort() })
    }, [])
    return (
        <React.Fragment>
            <div className="flex-column">
                <TitleHeader title="Character Sheets" />
                <BannerMenu list={subBanner} />
                <main>
                    {/* display all current character sheets */}
                    {/* create new  */ }
                    <ul className="stretch grid three_by_three no-decor">
                        {sheets.map((value, index) => {
                            if(value === 0){
                                return <CardTwo key={index} empty={true}></CardTwo>
                            }
                            return <CardTwo key={index}>{value}</CardTwo>
                        })}
                    </ul>
                </main>
            </div>
        </React.Fragment>
    )
}