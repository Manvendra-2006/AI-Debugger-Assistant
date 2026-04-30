import api from "../../../axios"

export async function debugCode({code}){
    try{
        const response = await api.post("/debug/code",{code}) 
        return response.data
    }
    catch(error){
        console.log("Error Occured",error)
    }
}