import { Calendar, DollarSign, HandFist, MoreVertical, Plus, Users } from "lucide-react";
import { ExpBadges } from "~/components/shared/exp-badges";

import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { Input } from "@repo/ui/input";
import SpotlightCard from "~/components/shared/spotlight-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { EventHeaderCard } from "~/features/event/components/dashboard-header-card";
import { useDashboardMetrics, useEvents } from "~/features/event/hooks/data";


const mockedAthletes = [
  {
    name: 'Lucas "Relâmpago" Souza',
    record: "8/3",
    exp: 'kids',
    weightclass: "Peso-leve",
    rankorPoints: "11"
  },
  {
    name: 'João "Trovão" Almeida',
    record: "12/6",
    exp: 'pro',
    weightclass: "Peso-meio-pesado",
    rankorPoints: "151231"
  },
  {
    name: 'Pedro "Furacão" Santos',
    record: "6/2",
    exp: 'amateur',
    weightclass: "Peso-pena",
    rankorPoints: "512"
  },
  {
    name: 'Rafael "Gigante" Oliveira',
    record: "15/5",
    exp: 'semipro',
    weightclass: "Peso-pesado",
    rankorPoints: "19"
  },
  {
    name: 'Bruno "Pantera" Lima',
    record: "9/4",
    exp: 'kids',
    weightclass: "Peso-galo",
      rankorPoints: "8"
  },
]

export default function Dashboard() {

  const { data: events } = useEvents({ skip: 0, take: 10 })
  const { data: metrics } = useDashboardMetrics()

  return (
    <div className='w-full h-full p-4'>
      {
        events.data?.map(event => <EventHeaderCard event={event} key={event.id} />)
      }

      <div className="w-full flex flex-col md:flex-row items-center gap-4">
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <Calendar size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Total de eventos</small>
            <h1 className="text-title">
              {metrics.totalEvents}
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <HandFist size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Total de atletas</small>
            <h1 className="text-title">
              {metrics.totalAthletes}
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <DollarSign size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Receita gerada</small>
            <h1 className="text-title">
              {metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <Users size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Novos inscritos</small>
            <h1 className="text-title">
              {metrics.newSubscribers}
            </h1>
          </div>
        </SpotlightCard>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-12 mt-12">
        <div className="flex-1 bg-background h-[200px]">
          <Tabs defaultValue="last-events">
            <TabsList>
              <TabsTrigger value="last-events">Últimos eventos</TabsTrigger>
              <TabsTrigger value="athletes">Atletas do evento</TabsTrigger>
            </TabsList>
            <TabsContent value="last-events">
              <span>Atletas</span>
            </TabsContent>
            <TabsContent value="athletes">
              <span>Eventos</span>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full flex flex-col max-w-[400px] bg-card h-[500px]">
          <header className="p-4 border-b border-border">
            <div className="w-full flex items-center justify-between">
              <span>Inscrições pendentes</span>
              <Button size={'sm'}><Plus /></Button>
            </div>

            <Input size={'sm'} className="w-full mt-2" placeholder="Pesquisar atletas"/>
          </header>
          <ul className="flex-1 overflow-auto">
            {
              mockedAthletes.map(item => (
                <li className="w-full hover:bg-secondary-foreground p-4 flex items-center justify-between">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center relative">
                      <Avatar className="size-16">
                        <AvatarFallback

                        >{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <ExpBadges exp={item.exp as any} size={"sm"} className="z-1 mt-1 absolute left-[50%] -translate-x-[50%] -bottom-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <small>{item.weightclass} ・ {item.record}</small>
                      </div>
                      <small className="font-semibold text-rankor">
                        {item.rankorPoints} RP
                      </small>
                    </div>
                  </div>

                  <Button size={'sm'} variant="text">
                    <MoreVertical />
                  </Button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
