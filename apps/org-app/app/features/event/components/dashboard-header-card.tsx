import dayjs from "dayjs"
import { Calendar, Clock, HandFist } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@repo/ui/button"
import SpotlightCard from "~/components/shared/spotlight-card"
import type { Event } from "../models/event"

type Props = {
  event: Event
}

export const EventHeaderCard = ({ event }: Props) => {

  return (
     <header className="mb-12" key={event.id}>
      <SpotlightCard className="w-full bg-card rounded-1 p-8 border-2 border-border flex flex-col md:flex-row items-center md:justify-between" spotlightColor="rgba(201, 28, 28, 0.5)">
        <div className="flex flex-col flex-1">
          <div className="mb-4">
            <h1 className="text-title">{event.name}</h1>
            <span className="text-sm">{event.description}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-rankor" size={24}/>
              <span>{dayjs(event.date).toLocaleString()}</span>
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

        <footer className="flex mt-8 md:mt-0 w-full md:w-auto gap-4 flex-0">
          <Link to={`/app/event/${event.id}`}>
            <Button className="w-full md:w-auto">Acessar painel</Button>
          </Link>
          <Link to={`/app/events/new/${event.id}`}>
            <Button 
              className="w-full md:w-auto" 
              variant={"secondary"}
            >
              Configurar
            </Button>
          </Link>
        </footer>
      </SpotlightCard>
    </header>
  )
}