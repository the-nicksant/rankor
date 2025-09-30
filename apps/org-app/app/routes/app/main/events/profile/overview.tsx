import type { Route } from "./+types/overview";
import { Skeleton } from "@repo/ui/skeleton";
import dayjs from "dayjs";

import banner from '~/assets/fighters.jpg'
import SpotlightCard from "~/components/shared/spotlight-card";
import { Calendar, ClipboardClock, DollarSign, HandFist, UserCheck2, Users } from "lucide-react";

import { motion } from "motion/react";

import { useEvent } from "~/features/event/hooks/data";
import { useEventFights } from "~/features/fight/hooks/data";

export function Loading (){
  return <Skeleton className="w-full"/>
}

export default function OverviewPage({ params }: Route.ComponentProps) {
  
  const { data: event, isLoading } = useEvent({ eventId: params.eventId })

  const { data: fights, isLoading: loadingFights } = useEventFights({ eventId: params.eventId })

  const metrics = {
    fights: 23,
    totalSubscriptions: 20,
    pendingSubscriptions: 11,
  }

  if(!event || isLoading){
    return (
      <div className="w-full py-4 flex flex-col gap-4">
        <Skeleton
          className="w-full h-[300px]"
        />
        <div className="flex gap-4 h-[200px]">
          <Skeleton 
            className="flex-1"
          />
          <Skeleton 
            className="flex-2"
          />
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-4"
    >
      <div className="w-full flex flex-col md:flex-row gap-4 border border-input">
        <div 
          className="h-[300px] w-full md:w-[55%] bg-rankor/20" 
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="flex flex-col gap-4 md:gap-8 justify-end w-full p-4 md:justify-start md:top-0 md:left-0 z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="h-fit">
              <span className="text-label">Data</span>
              <p>{dayjs(event?.date).format('lll')}</p>
            </div>
            <div className="h-fit">
              <span className="text-label">Período de inscrições</span>
              {
                event.subscriptionConfig
                  ? <p>{dayjs(event.subscriptionConfig.startSubscription).format('l')} até {dayjs(event.subscriptionConfig.endSubscription).format('l')}</p>
                  : <p></p>
              }
            </div>
          </div>
          <div className="h-fit">
            <span className="text-label">Status</span>
            <p>Inscrições abertas</p>
          </div>
          <div className="h-fit">
            <span className="text-label">Endereço</span>
            <p className="max-w-[300px]">{event.address.street}, {event.address.number} - {event.address.district}, {event.address.city}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center gap-4 mt-4">
      <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
        <HandFist size={30} className="text-rankor"/>
        <div>
          <small className="text-muted-foreground">Lutas criadas</small>
          <h1 className="text-title">
            {metrics.fights}
          </h1>
        </div>
      </SpotlightCard>
      <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
        <UserCheck2 size={30} className="text-rankor"/>
        <div>
          <small className="text-muted-foreground">Atletas inscritos</small>
          <h1 className="text-title">
            {metrics.totalSubscriptions}
          </h1>
        </div>
      </SpotlightCard>
      <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
        <ClipboardClock size={30} className="text-rankor"/>
        <div>
          <small className="text-muted-foreground">Inscrições pendentes</small>
          <h1 className="text-title">
            {metrics.totalSubscriptions}
          </h1>
        </div>
      </SpotlightCard>
    </div>
  </motion.div>
  )
}
