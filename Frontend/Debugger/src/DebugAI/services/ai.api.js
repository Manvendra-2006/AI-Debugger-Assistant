import api from "../../../axios"

export async function debugCode({code}){
    try{
        console.log('🔧 Sending code for debugging...')
        const response = await api.post("/debug/code",{code}) 
        console.log('✅ Debug response received:', response.data)
        return response.data
    }
    catch(error){
        console.error("❌ Debug Error:", error)
        throw error
    }
}

export async function getDebugHistory(){
    try{
        console.log('📥 Fetching user debug history from API...')
        const response = await api.get("/debug/history")
        
        // Ensure we always return an array
        const history = response.data.history || response.data || []
        const validHistory = Array.isArray(history) ? history : []
        
        console.log(`✅ History API response received. Records: ${validHistory.length}`)
        return validHistory
    }
    catch(error){
        console.error("❌ History Fetch Error:", error)
        console.warn('⚠️ Returning empty array due to API error')
        // Return empty array on error to avoid showing old cached data
        return []
    }
}