
import React, { useState, useEffect, createContext, useContext, forwardRef } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"


type CardElementType = React.HTMLAttributes<HTMLElement>


interface CardType {
  (props: { noGrid?: boolean; children?: React.ReactNode; className?: string; noPadding?: boolean; disableAnimation?: boolean }): React.ReactNode,
  Title: (prop: { className?: string; children?: React.ReactNode } & CardElementType) => React.ReactNode,
  Content: (prop: { className?: string; children?: React.ReactNode } & CardType) => React.ReactNode,
  Image: (prop: { className?: string; children?: React.ReactNode; imageProps?: { imageClassName?: string;[key: string]: unknown } & CardElementType } & CardElementType) => React.ReactNode,
  Body: (prop: { className?: string; children?: React.ReactNode } & CardElementType) => React.ReactNode,
}

const CardContext = createContext<{ noGrid: boolean }>({ noGrid: false })

const Card: CardType = function App({ noGrid = false, children, className = "", noPadding = false, disableAnimation = false }) {
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
        <div>
          {children}
        </div>
      </div>
    </CardContext>
  )
}


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