
import { useEffect } from "react"


const isDev = process.env.NODE_ENV === "development"

export default function App(): null {
  useEffect(() => {
    // isDev && window.eruda?.init()
  }, [])
  return null
}