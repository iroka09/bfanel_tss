
import { useState, useEffect, forwardRef } from "react"
import { useInView } from "react-intersection-observer"


export default forwardRef(({ children, className = "", noPadding = false, disableAnimation = false }, _ref) => {
  const [isClient, setIsClient] = useState(false)
  const { inView, ref } = useInView({ threshold: 0.2, triggerOnce: false, skip: disableAnimation })
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-all duration-[.8s] translate-y-[20px] opacity-0 ${(disableAnimation ||isClient===false|| inView) ? "!translate-y-0 opacity-100" : ""} bg-white [:is(#products,#faqs)_&]:bg-black/10 dark:bg-black/20 ${noPadding ? "" : "p-6"} overflow-hidden shadow-md dark:shadow-none rounded-lg ${className}`}
    >
      <div ref={_ref}>
        {children}
      </div>
    </div>
  )
})