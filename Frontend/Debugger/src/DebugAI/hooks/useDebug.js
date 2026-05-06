import { useContext } from "react"
import { DebugContext } from "../state/debug.context"
import { debugCode } from "../services/ai.api"

export function useDebug() {
  const context = useContext(DebugContext)
  const { loading, setloading, codeReport, setcodeReport } = context

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

  return {
    loading,
    handleDebugAI,
    codeReport,
    setcodeReport,
  }
}
   