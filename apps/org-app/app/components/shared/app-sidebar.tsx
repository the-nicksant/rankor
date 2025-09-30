import * as React from "react"
import { Calendar, ChartSpline, CircleStar, HandFist, Home } from "lucide-react"

import RankorLogo from '~/assets/rankor-white.png' 

import { NavUser } from "~/components/shared/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/sidebar"
import { useLocation, useNavigate } from "react-router"

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/app/home",
      icon: Home,
      disabled: false,
      secondarySidebar: null
    },
    {
      title: "Eventos",
      url: "/app/events",
      icon: Calendar,
      disabled: false,
      secondarySidebar: <div />
    },
    {
      title: "Perfil",
      url: "/app/profile",
      icon: CircleStar,
      disabled: true,
      secondarySidebar: <div />
    },
    {
      title: "Atletas",
      url: "/app/athletes",
      icon: HandFist,
      disabled: true,
      secondarySidebar: <div />
    },
    {
      title: "Métricas",
      url: "/app/dashboard",
      icon: ChartSpline,
      disabled: true,
      secondarySidebar: null
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate()

  const activeItem = React.useMemo(() => 
    data.navMain.find(nav => location.pathname.includes(nav.url)), 
  [location])

  const { setHasAdditionalHeader } = useSidebar()

  React.useEffect(() => {
    if(activeItem?.secondarySidebar) return setHasAdditionalHeader(true)

    setHasAdditionalHeader(false)
  }, [activeItem])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img src={RankorLogo} alt="Rankor" className="w-[25px]" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Rankor</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      disabled={item.disabled}
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        navigate(item.url, { viewTransition: true })
                      }}
                      isActive={activeItem?.url === item.url}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {
        activeItem?.secondarySidebar && (
          <Sidebar collapsible="none" className="hidden flex-1 md:flex w-[330px]">
            <SidebarHeader className="gap-3.5 border-b p-4 h-[60px]">
              <div className="flex w-full items-center justify-between">
                <div className="text-foreground text-base font-medium">
                  {activeItem?.title}
                </div>
              </div>
              {/* <SidebarInput placeholder="Type to search..." /> */}
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  {activeItem.secondarySidebar}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )
      }

    </Sidebar>
  )
}
