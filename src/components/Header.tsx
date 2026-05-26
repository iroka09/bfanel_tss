
import { useState, useEffect, type ReactNode, type PropsWithChildren } from "react"
import { useHeadroom, useMediaQuery, useWindowScroll } from "@mantine/hooks"
import { Link, useLocation } from "@tanstack/react-router"
import { MdPalette as PaletteIcon } from "react-icons/md"
import { MdAppSettingsAlt as AppSettingsAltIcon } from "react-icons/md"
import { MdLightMode as LightModeIcon } from "react-icons/md"
import { MdCheck as CheckIcon } from "react-icons/md"
import { MdDarkMode as DarkModeIcon } from "react-icons/md"
import ClickAwayListener from 'react-click-away-listener';
import DrawerWithIcon from "@/components/Drawer"
import Nav from "@/components/Nav"
import Portal from "@/components/Portal"
import { useAppSession } from '@/context/session';
import { cn } from "@/lib/utils"


function Wrapper({ children, isHome, ...props }: PropsWithChildren) {
  if (!isHome) return children
  return (
   
      children
  
  )
}


export default function App(): ReactNode {
  const pinned = useHeadroom({ fixedAt: 120 })
  const { session, isAuthenticated } = useAppSession()
  const pathname = useLocation({ select: loc => loc.pathname })
  const isHome = pathname === "/"
  const [scroll] = useWindowScroll();
  const notAtTop = scroll.y >= 120;
  return (
    <Wrapper isHome={isHome}>
      <header
        className={cn(
          "sticky top-0 inset-x-0 pr-2 py-1 flex  whitespace-nowrap justify-between items-center gap-2 min-w-full z-50 transition-transform duration-300 bg-white/50 dark:bg-black/30 shadow-md",
          pinned ? "translate-y-0" : "-translate-y-full",
          (isHome)
            ? notAtTop && "backdrop-blur-sm"
            : "backdrop-blur-sm"

        )}
      >
        <Link to="/" className="flex items-center overflow-hidden">
          <img src="/logo_low.png" width={60} height={20} alt="logo" loading="eager" />
          <h1 className="font-bold text-ellipsis overflow-hidden">B-Fanel Industries</h1>
        </Link>
        <div className="hidden md:block ml-auto">
          <Nav />
        </div>
        <div className="flex gap-3 items-center">
          {isAuthenticated && (
            <Link to="/profile">
              <img src={session.picture} className="w-[30px] min-w-[30px] aspect-square rounded-full border-2" alt="avatar" />
            </Link>
          )}
          <ThemeButtonWrapper renderToBottomScreenOnly={true} />
          <div className="md:hidden">
            <DrawerWithIcon />
          </div>
        </div>
      </header>
    </Wrapper>
  )
}



type ThemeValuesType = "light" | "dark" | "system"
const themeButtons: { key: ThemeValuesType, title: string, icon: ReactNode }[] = [
  {
    key: "light",
    title: "Light Mode",
    icon: LightModeIcon
  },
  {
    key: "dark",
    title: "Dark Mode",
    icon: DarkModeIcon
  },
  {
    key: "system",
    title: "System Theme",
    icon: AppSettingsAltIcon
  },
]


function ThemeButtonWrapper({ renderToBottomScreenOnly = false }) {
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  return (
    <Portal disable={renderToBottomScreenOnly === false && !isMediumScreen}>
      <ThemeButton renderToBottomScreenOnly={renderToBottomScreenOnly} />
    </Portal>
  )
}


function ThemeButton({ renderToBottomScreenOnly }) {
  const [theme, setTheme] = useState<ThemeValuesType>("system")
  const [show, setShow] = useState(false)
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme")
    if (savedTheme === "light") setTheme("light")
    else if (savedTheme === "dark") setTheme("dark")
    else setTheme("system")
  }, [])
  useEffect(() => {
    try {
      switch (theme) {
        case "light":
          document.documentElement.classList.remove("dark");
          break;
        case "dark":
          document.documentElement.classList.add("dark")
          break;
        case "system":
          const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          function mediaQueryFn() {
            if (darkModeMediaQuery.matches) {
              document.documentElement.classList.add("dark")
            }
            else {
              document.documentElement.classList.remove("dark")
            }
          }
          mediaQueryFn()
          darkModeMediaQuery.addEventListener("change", mediaQueryFn);
          return () => darkModeMediaQuery.removeEventListener("change", mediaQueryFn);
        default:
      }
    }
    finally {
      window.localStorage.setItem("theme", theme)
    }
  }, [theme])
  return (
    <div
      className={cn(
        renderToBottomScreenOnly
          ? "relative fixed bottom-10 left-3 z-10 bg-black/50 dark:bg-white/20 dark:border dark:border-white/30 dark:backdrop-blur-sm rounded-md p-2 shadow-lg"
          : "relative md:fixed md:bottom-10 md:left-3 md:z-10 md:bg-black/50 md:dark:bg-white/20 md:dark:border md:dark:border-white/30 md:dark:backdrop-blur-sm md:rounded-md md:p-2 md:shadow-lg"
      )}
    >
      <button onClick={() => setShow(true)}>
        <PaletteIcon
          className={cn(
            renderToBottomScreenOnly
              ? "icon text-2xl text-white"
              : "icon text-2xl md:text-white"
          )}
        />
      </button>
      {show &&
        <ClickAwayListener onClickAway={() => setShow(false)}>
          <ul
            className={cn(
              renderToBottomScreenOnly
                ? "absolute top-[initial] right-[initial] bottom-0 left-0 z-1 rounded-md overflow-hidden bg-white shadow-lg dark:bg-black *:relative *:pl-4 *:pr-14 *:py-3 text-primary *:whitespace-nowrap *:flex *:gap-3 hover:*:bg-slate-200/80 dark:hover:*:bg-slate-500/50"
                : "absolute top-0 right-0 md:top-[initial] md:right-[initial] md:bottom-0 md:left-0 z-1 rounded-md overflow-hidden bg-white shadow-lg dark:bg-black *:relative *:pl-4 *:pr-14 *:py-3 text-primary *:whitespace-nowrap *:flex *:gap-3 hover:*:bg-slate-200/80 dark:hover:*:bg-slate-500/50"
            )}
          >
            {themeButtons.map((obj, i) => (
              <li
                key={i}
                onClick={() => {
                  setTheme(obj.key)
                }}
              >
                {<obj.icon />} <span>{obj.title}</span> {theme === obj.key &&
                  <CheckIcon
                    className={cn(
                      "text-green-400 ml-auto absolute top-[50%] right-3 translate-y-[-50%]"
                    )}
                  />
                }
              </li>
            ))}
          </ul>
        </ClickAwayListener>
      }
    </div>
  )
  /*return (<>
          <div
            className={cn(
              renderToBottomScreenOnly ?
                "relative fixed bottom-10 left-3 z-10 bg-black/50 rounded-md p-2 shadow-lg"
                :
                "relative md:fixed md:bottom-10 md:left-3 md:z-10 md:bg-black/50 md:rounded-md md:p-2 md:shadow-lg"
            )}
          >
            <button onClick={() => setShow(true)}>
              <PaletteIcon className="icon text-2xl md:text-white" />
            </button>
            {show &&
              <ClickAwayListener onClickAway={() => setShow(false)}>
                <ul className="absolute top-0 right-0 md:top-[initial] md:right-[initial] md:bottom-0 md:left-0 z-1 rounded-md overflow-hidden bg-white shadow-lg dark:bg-black *:relative *:pl-4 *:pr-14 *:py-3 text-primary *:whitespace-nowrap *:flex *:gap-3 hover:*:bg-slate-200/80 dark:hover:*:bg-slate-500/50">
                  {themeButtons.map((obj, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setTheme(obj.key)
                      }}
                    >
                      {<obj.icon />} <span>{obj.title}</span> {theme === obj.key && <CheckIcon className="text-green-400 ml-auto absolute top-[50%] right-3 translate-y-[-50%]" />}
                    </li>
                  ))}
                </ul>
              </ClickAwayListener>
            }
          </div >
        </>)*/
}