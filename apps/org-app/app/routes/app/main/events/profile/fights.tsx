import type { Route } from "./+types/fights";
import { Skeleton } from "@repo/ui/skeleton";

import { motion } from "motion/react";

import { useEvent } from "~/features/event/hooks/data";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Search } from "lucide-react";
import { FightCard } from "~/features/fight/components/fight-card";
import Select from "@repo/ui/select";
import { Experience, experienceOptions } from "~/features/athlete/domain/experience";
import { useModalsStore } from "~/shared/stores/modal-store";
import { ModalKeys } from "~/components/shared/app-modals";

export function Loading (){
  return <Skeleton className="w-full"/>
}

export default function FightsPage({ params }: Route.ComponentProps) {
  
  const openModal = useModalsStore(s => s.openModal)
  const { data: event, isLoading } = useEvent({ eventId: params.eventId })

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
      <header className="py-8 border-b border-border">
        <div className="flex flex-col gap-4 md:w-[40%]">
          <h1 className="text-title text-4xl">Lutas</h1>
          <p className="text-sm">
            Aqui você pode gerenciar todas as lutas do seu evento. Adicione, edite ou remova lutas conforme necessário para garantir que tudo esteja pronto para o grande dia.
          </p>
        </div>
      </header>

      <section className="w-full">
        <header className="w-full py-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <Input 
            icon={<Search size={14}/>}
            className="w-full md:max-w-[300px]"
            placeholder="Sérgio, Boxe, Amador..."
          />

          <div className="flex flex-row items-start w-full md:w-fit gap-2">
            <Select 
              value="muaythai"
              placeholder="Selecione uma modalidade"
              onChange={() => {}}
              options={[
                {
                  label: 'MuayThai',
                  value: 'muaythai'
                },
                {
                  label: 'Boxe',
                  value: 'boxing'
                },
              ]}
            />
            <Select 
              value={Experience.AMATEUR}
              placeholder="Selecione uma categoria"
              onChange={() => {}}
              options={experienceOptions}
            />
            <Button onClick={() => openModal(ModalKeys.create_fight, { eventId: event.id })}>
              Adicionar luta
            </Button>
          </div>
        </header>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          <FightCard />
          <FightCard />
          <FightCard />
          <FightCard />
          <FightCard />
          <FightCard />
          <FightCard />
          <FightCard />
        </div>
      </section>


    
  </motion.div>
  )
}
