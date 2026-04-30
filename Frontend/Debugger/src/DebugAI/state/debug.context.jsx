import { useState } from "react";
import { createContext } from "react";

export const DebugContext = createContext()
export function DebubgProvider({children}){
    const [loading,setloading] = useState(false)
    const [codeReport,setcodeReport] = useState(null)
    return(
        <DebugContext.Provider value={{loading,setloading,codeReport,setcodeReport}}>
            {children}
        </DebugContext.Provider>
    )
}