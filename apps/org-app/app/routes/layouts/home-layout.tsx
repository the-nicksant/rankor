import { Bell, HelpCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { AppSidebar } from "~/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@repo/ui/breadcrumb";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/sidebar";
import useAuthStore from "~/features/authentication/stores/auth";

export default function Homelayout () {
  const accessToken = useAuthStore(s => s.accessToken)
  const navigate = useNavigate()

  useEffect(() => {
    if(!accessToken){
      navigate('/app/login')
    }
  }, [accessToken])

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset className="h-full bg-linear-to-t from-rankor/10 from-0% to-30% to-background">
          <header className="sticky top-0 z-50 bg-background flex items-center justify-between shrink-0 border-b p-4 h-[60px] w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={'text'}>
                <Bell />
              </Button>

              <Button variant={'text'}>
                <HelpCircle />
              </Button>
              
              <Link to={'/app/events/new'} viewTransition>
                <Button>
                  <Plus />
                  Criar novo evento
                </Button>
              </Link>
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}