import { useAuth } from "../hooks/useAuth";
import { useAxiosP } from "../hooks/useAxiosP";

export function CharacterPage() {
    const { auth } = useAuth();
    const useAxios = useAxiosP();

    
    console.log(auth);
    if (auth !== null) { 
        return (
            <section>
                User Detected...
            </section>
        )
    }

    return (
        <section>
            <div className="form-group">This is the Character Page placeholder.</div>
        </section>
    );
}