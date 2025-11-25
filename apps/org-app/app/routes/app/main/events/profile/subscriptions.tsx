import type { Route } from "./+types/fights";
import { Skeleton } from "@repo/ui/skeleton";

import { motion } from "motion/react";

import { useEvent, useSubscriptions } from "~/features/event/hooks/data";
import { Input } from "@repo/ui/input";
import { DataTable } from "@repo/ui/data-table";
import { Check, CheckCheckIcon, CheckCircle, Clock, Copy, Search, User, X, XCircle } from "lucide-react";
import Select from "@repo/ui/select";
import { Experience, experienceOptions } from "~/features/athlete/domain/experience";
import { useModalsStore } from "~/shared/stores/modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import SpotlightCard from "~/components/shared/spotlight-card";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import { faker } from "@faker-js/faker";

export function Loading (){
  return <Skeleton className="w-full"/>
}

export default function SubscriptionsPage({ params }: Route.ComponentProps) {
  
  const openModal = useModalsStore(s => s.openModal)

  const [currentPage, setCurrentPage] = useState(1);
  const take = 30

  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const [selectedExpertises, setSelectedExpertises] = useState<string[]>([])

  const { data: event, isLoading } = useEvent({ eventId: params.eventId })

  const { data: subscriptions, isLoading: loadingSubscriptions } = useSubscriptions({
    eventId: event?.id!,
    skip: (currentPage - 1) * take,
    take: take,
  })

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
      <header className="py-8 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-4 md:w-[40%]">
          <h1 className="text-title text-4xl">Inscrições</h1>
          <p className="text-sm">
            Gerencie todas as inscrições do seu evento aqui. Aproveite para revisar, aprovar ou rejeitar inscrições conforme necessário, garantindo que apenas atletas qualificados participem do evento.
          </p>
          <Button variant="link" icon={<Copy />} className="w-fit">Copiar link de inscrição</Button>
        </div>

        <div className="flex flex-col gap-8 py-6 md:gap-12 md:flex-row sm:items-start">
          <article className="flex flex-col items-center text-center">
            <span className="text-muted-foreground text-sm">Progresso das inscrições</span>
            <h2 className="text-3xl font-semibold text-rankor">15/40</h2>
            <small className="text-muted-foreground text-xs font-thin">Restam 25 vagas</small>
          </article>
          <article className="flex flex-col items-center text-center">
            <span className="text-muted-foreground text-sm">Total arrecadado</span>
            <h2 className="text-3xl font-semibold text-rankor">R$ 1457,00</h2>
          </article>
        </div>
      </header>

      <section className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <CheckCircle size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Inscrições aprovadas</small>
            <h1 className="text-title">
              13
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <Clock size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Inscrições pendentes</small>
            <h1 className="text-title">
              23
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <XCircle size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">Inscrições recusadas</small>
            <h1 className="text-title">
              3
            </h1>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="bg-card p-4 flex gap-4 items-center w-full">
          <CheckCheckIcon size={30} className="text-rankor"/>
          <div>
            <small className="text-muted-foreground">
              Atletas confirmados
            </small>
            <h1 className="text-title">
              8
            </h1>
          </div>
        </SpotlightCard>
      </section>

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
          </div>
        </header>

        <DataTable 
          data={subscriptions?.data || []}
          pagination={true}
          pageSize={take}
          loading={isLoading}
          columns={[
            {
              accessorKey: 'name',
              header: 'Atleta',
              cell: ({ row }) => (
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={faker.image.personPortrait({ sex: 'male' })}/>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("name")}</span>
                    <small className="text-muted-foreground">São Paulo ・ 12 / 4 / 1</small>
                  </div>
                </div>
              )
            },
            {
              accessorKey: 'modality',
              header: 'Modalidade',
            },
            {
              accessorKey: 'expertise',
              header: 'Experiência',
            },
            {
              accessorKey: 'weightClass',
              header: 'Categoria de peso',
            },
            {
              accessorKey: 'status',
              enableSorting: false,
              header: 'Status',
            },
            {
              accessorKey: 'actions',
              header: 'Ações',
              enableSorting: false,
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button icon={<Check />} variant={'secondary'} size={'sm'}/>
                  <Button icon={<X />} variant={'destructive'} size={'sm'}/>
                </div>
              )
            },

          ]}
        />
      </section>
  </motion.div>
  )
}
