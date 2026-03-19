
import { useState, useEffect, type ReactNode } from "react"
import { useHeadroom, useMediaQuery } from "@mantine/hooks"
import { Link } from "@tanstack/react-router"
import { MdPalette as PaletteIcon } from "react-icons/md"
import { MdAppSettingsAlt as AppSettingsAltIcon } from "react-icons/md"
import { MdLightMode as LightModeIcon } from "react-icons/md"
import { MdCheck as CheckIcon } from "react-icons/md"
import { MdDarkMode as DarkModeIcon } from "react-icons/md"
import ClickAwayListener from 'react-click-away-listener';
import DrawerWithIcon from "@/components/Drawer"
import Nav from "@/components/Nav"
import Portal from "@/components/Portal"



export default function App(): ReactNode {
  const pinned = useHeadroom({ fixedAt: 120 })
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  return (<>
    <header className={`sticky top-0 inset-x-0 pr-2 py-1 flex justify-between items-center gap-2 min-w-full z-50 transition-transform duration-300 bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-md ${pinned ? "translate-y-0" : "-translate-y-full"}`}>
      <Link to="/" className="flex items-center">
        <img src="/logo_low.png" width={60} height={20} alt="logo" loading="eager" />
        <h1 className="font-bold">B-Fanel Industries</h1>
      </Link>
      <div className="hidden md:block ml-auto">
        <Nav />
      </div>
      <div className="flex gap-4 items-center">
        {
          isMediumScreen ?
            <Portal>
              <ThemeButton />
            </Portal>
            :
            <ThemeButton />
        }
        <div className="md:hidden">
          <DrawerWithIcon />
        </div>
      </div>
    </header>
  </>)
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

function ThemeButton() {
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
  return (<>
    <div className="relative md:fixed md:bottom-10 md:left-3 md:z-10 md:bg-black/50 md:rounded-md md:p-2 md:shadow-lg">
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
  </>)
}