
import { Input } from "@repo/ui/input"
import { Search } from "lucide-react"
import React from "react"
import AthleteListItem from "~/features/athlete/components/athlete-list-item"

const mockAthlete = {
  "firstname":"Diego",
  "lastname": "Figueiredo 5",
  "nickname":"Quebra Queixo",
  "birthdate": "1986-08-20T00:00:00Z",
  "city":"Cascata",
  "state":"Porto Alegre",
  "country": "Brasil",
  "phone":"51997703846",
  "document":"37736302627",
  "email": "diegojulio9.figueiredo@spires.com.br",
  "weight": 90,
  "height":173,
  "modalities": ["jiujitsu", "mma"],
  "expertises": ["amateur", "semipro"]
}

export const AthletesTab = () => {
  return (
    <div className='bg-card rounded-lg border'>
      <header className='p-6'>
        <h3 className='font-semibold text-lg'>Atletas Inscritos</h3>
        <p className='text-muted-foreground text-sm'>Lista de atletas será exibida aqui.</p>
      </header>

      <div className=''>
        <header className='flex flex-col items-center md:justify-between px-6 pb-4'>
          <Input 
            icon={<Search size={14}/>}
            placeholder='Pesquisar atletas'
          />
        </header>

        <div>
          <AthleteListItem athlete={mockAthlete} />
          <AthleteListItem athlete={mockAthlete} />
          <AthleteListItem athlete={mockAthlete} />
          <AthleteListItem athlete={mockAthlete} />
        </div>
      </div>
    </div>
  )
}
