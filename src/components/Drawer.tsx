
import { useState, useEffect } from 'react'
import { Spin as Hamburger } from 'hamburger-react'
import { Drawer } from "vaul";
import Nav from "@/components/Nav"
import SocialMediaContacts from "@/components/SocialMediaContacts"
import { useLocation } from '@tanstack/react-router'


export default function Navbar({ children }) {
  const [showDrawer, setShowDrawer] = useState(false)
  const [pathname, href] = useLocation({
    select: (location) => [location.pathname, location.href]
  })
  useEffect(() => {
    setShowDrawer(false)
  }, [href])
  return (
    <Drawer.Root direction="left" open={showDrawer} onOpenChange={setShowDrawer}>
      <Drawer.Trigger asChild>
        <Hamburger toggled={showDrawer} toggle={setShowDrawer} size={23} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <div className="relative z-[100]">
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed left-0 top-0 h-full w-[80%] bg-white dark:bg-black text-primary p-6 mobile flex flex-col justify-between">
            <Drawer.Title className="sr-only">Drawer navigation bar</Drawer.Title>
            <Nav />
            <div className="flex justify-center">
              <SocialMediaContacts />
            </div>
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
}