import { DateContext } from "./DateContext";
import { useContext } from "react"

export const DateProvider = () => {
    return useContext(DateContext);
}