
import React, { useState, useEffect, createContext, useContext, forwardRef } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"


interface CardType {
  (prop: any): React.ReactNode,
  title: (prop: any) => React.ReactNode,
  content: (prop: any) => React.ReactNode,
  image: (prop: any) => React.ReactNode,
  body: (prop: any) => React.ReactNode,
}

const CardContext = createContext()

const Card = forwardRef(({ noGrid = false, children, className = "", noPadding = false, disableAnimation = false }, _ref) => {
  const [isClient, setIsClient] = useState(false)
  const { inView, ref } = useInView({ threshold: 0.2, triggerOnce: false, skip: disableAnimation })
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <CardContext value={{ noGrid }}>
      <div
        ref={ref}
        className={cn(
          "transition-[transform_opacity] duration-[.6s]",
          "translate-y-[20px] opacity-0",
          (disableAnimation || isClient === false || inView) && "!translate-y-0 opacity-100",
          noPadding || "p-6",
          className
        )}
      >
        <div ref={_ref}>
          {children}
        </div>
      </div>
    </CardContext>
  )
})

Card.Title = function ({ className, children }) {
  return (
    <h2
      className={cn(
        "text-xl font-bold py-3",
        className,
      )}
    >
      {children}
    </h2>
  )
}

Card.Content = function ({ className, children }) {
  const { noGrid } = useContext(CardContext)
  return (
    <div
      className={cn(
        noGrid || "md:grid md:grid-cols-2 gap-2",
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.Image = function ({
  className,
  children,
  imageProps: { imageClassName, ...imageProps }
}) {
  return (
    <div
      className={cn(
        "w-full ",
        className,
      )}
    >
      {children ||
        <img
          {...imageProps}
          className={cn(
            "",
            imageClassName
          )}
        />
      }
      {children}
    </div>
  )
}

Card.Body = function ({ className, children }) {
  const { noGrid } = useContext(CardContext)
  return (
    <p
      className={cn(
        noGrid || "md:p-0",
        className,
      )}
    >
      {children}
    </p>
  )
}

export default Card