import dayjs from "dayjs"
import { Calendar, Clock, ExternalLink, HandFist } from "lucide-react"
import { Link, Outlet, useLoaderData, useLocation, useNavigate, useParams, useRouteLoaderData } from "react-router"
import { Button } from "@repo/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { useEvent } from "~/features/event/hooks/data"

export default function EventLayout() {
  const path = useLocation()
  const { eventId } = useParams()
  const navigate = useNavigate()

  const { data: event, isLoading } = useEvent({ eventId: eventId! })

  const buildTabValue = (key: string) => {
    return `/app/event/${eventId}/${key}`
  }

  return (
    <div className="w-full max-w-[100vw] h-full min-h-[calc(100vh-50px)] p-4 flex justify-center animate-in">
      <div className="max-w-[1200px] w-full">
        {
          (event) && (
            <header className="flex flex-col md:flex-row md:justify-between gap-12 py-4">
              <div>
                <h1 className="text-title text-3xl mb-2">
                  {event.name}
                </h1>
                <span className="text-sm">{event.description}</span>

                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-rankor" size={24}/>
                    <span>{dayjs(event.date).format('ll')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <HandFist className="text-rankor" size={24}/>
                    <span>34 atletas confirmados</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-rankor" size={24}/>
                    <span>Faltam {dayjs(event.date).diff(dayjs(), 'days')} dias</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row ">
                <Link
                  hidden={!event.website}
                  to={`https://rankor.com.br/event/${event.website}`}
                  target="_blank"
                  rel="noopener"
                  className="h-fit w-fit"
                >
                  <Button
                    icon={<ExternalLink />}
                    size={'sm'}
                    className="w-full md:w-fit"
                  >
                    Ver painel público
                  </Button>
                </Link>
              </div>
            </header>
          )
        }

        <Tabs 
          className="mt-8" 
          defaultValue={buildTabValue('')}
          onValueChange={(key) => navigate(key)}
          value={location?.pathname}
        >
          <TabsList className="overflow-x-scroll h-fit">
            <TabsTrigger value={buildTabValue('')}>
              Visão geral
            </TabsTrigger>
            <TabsTrigger value={buildTabValue('fights')}>
              Lutas
            </TabsTrigger>
            <TabsTrigger value={buildTabValue('subscriptions')}>
              Inscrições
            </TabsTrigger>
            <TabsTrigger value={buildTabValue('timeline')}>
              Cronograma
            </TabsTrigger>
            <TabsTrigger value={buildTabValue('settings')}>
              Configurações
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Outlet />
      </div>
    </div>
  )
}