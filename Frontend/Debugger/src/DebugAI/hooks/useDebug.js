import { useContext } from "react"
import { DebugContext } from "../state/debug.context"
import { debugCode, zipUpload } from "../services/ai.api"

export function useDebug() {
  const context = useContext(DebugContext)
  const { loading, setloading, codeReport, setcodeReport ,setresult } = context

  async function handleDebugAI({ code }) {
    setloading(true)
    try {
      const data = await debugCode({ code })
      setcodeReport(data)
      return data
    } catch (error) {
      console.error("Error Occurred", error)
      return null
    } finally {
      setloading(false)
    }
  }

  async function handleZip(formData){
    setloading(true)
    try{
      const data = await zipUpload(formData)
      console.log("API ka result niche")
      console.log(data)      
      setresult(data)
      return data
    }
    catch(error){
      console.log("Error Occured",error)
      return null
    }
    finally{
      setloading(false)
    }
  }
  return {
    loading,
    handleDebugAI,
    handleZip,
    codeReport,
    setcodeReport,
  }
}
   