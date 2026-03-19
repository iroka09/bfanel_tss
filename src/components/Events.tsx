
import { useEffect } from "react"


const isDev = process.env.NODE_ENV === "development"

export default function App() {
  useEffect(() => {
   // isDev && window.eruda?.init()
  }, [])
}