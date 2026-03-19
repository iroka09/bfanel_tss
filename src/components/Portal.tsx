
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Portal({ children }) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
    return () => setIsClient(false)
  }, [])
  return isClient ?
    createPortal(children, document.body)
    : 
    null
  // <div className="sr-only">{children}</div>
}
