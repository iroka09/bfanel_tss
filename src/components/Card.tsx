
import React, { useState, useEffect, createContext, useContext, forwardRef } from "react"
import { useInView } from "react-intersection-observer"
import { clsx } from "clsx"


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
        className={clsx(
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

Card.title = function ({ className, children }) {
  return (
    <h2
      className={clsx(
        "text-xl font-bold py-3",
        className,
      )}
    >
      {children}
    </h2>
  )
}

Card.content = function ({ className, children }) {
  const { noGrid } = useContext(CardContext)
  return (
    <div
      className={clsx(
        noGrid || "md:grid md:grid-cols-2 gap-2",
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.image = function ({
  className,
  children,
  imageProps: { imageClassName, ...imageProps }
}) {
  return (
    <div
      className={clsx(
        "w-full ",
        className,
      )}
    >
      {children ||
        <img
          {...imageProps}
          className={clsx(
            "",
            imageClassName
          )}
        />
      }
      {children}
    </div>
  )
}

Card.body = function ({ className, children }) {
  const { noGrid } = useContext(CardContext)
  return (
    <p
      className={clsx(
        noGrid || "md:p-0",
        className,
      )}
    >
      {children}
    </p>
  )
}

export default Card