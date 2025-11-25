import { faker, fakerPT_BR } from '@faker-js/faker'
import { Avatar, AvatarImage } from '@repo/ui/avatar'
import type { Athlete } from '~/features/athlete/domain/athlete'
import type { Experience } from '~/features/athlete/domain/experience'
import { cn } from '~/lib/cn'

type FightCardProps = {
  fight: {
    id: string
    expertise: Experience,
    weightclass: string,
    modality: string
  }
  athleteA: Athlete,
  athleteB: Athlete,
}

export const FightCard = ({ fight, athleteA, athleteB }: FightCardProps ) => {
  
  return (
    <div className='w-full max-h-[250px] flex items-center border border-border relative group transition-all cursor-pointer hover:border-white'>
      <div className='absolute top-0 left-0 bg-white text-black text-xs px-2 py-1 rounded-br-md z-20'>
        {fight.modality}
      </div>

      <div className='absolute top-0 right-0 bg-rankor text-white text-xs px-2 py-1 rounded-bl-md z-20'>
        {fight.expertise}
      </div>

      <span className='absolute top-2 left-[50%] -translate-x-[50%] text-white italic uppercase text-xs text-center z-20'>
        {fight.weightclass}
      </span>

      {/* athlete a */}
      <AthleteSide corner='a' athlete={athleteA}/>

      <div className='text-rankor text-sm absolute selft-center left-[50%] -translate-x-[50%] z-10'>
        VS
      </div>

      {/* athlete b */}
      <AthleteSide corner='b' athlete={athleteB}/>

      
    </div>
  )
}

const AthleteSide = ({ corner, athlete }: { corner: 'a' | 'b', athlete: Athlete }) => {
  return (
    <div 
      className={cn(
        'flex-1 flex flex-col justify-end h-full p-6 pt-8 gap-2 relative', 
        corner === 'a' 
          ? 'items-end text-right pr-5 bg-corner-a' 
          : 'items-start text-left pl-5 bg-corner-b'
      )}
    >
      <Avatar className='group-hover:scale-105 transition-all size-20'>
        <AvatarImage src={fakerPT_BR.image.personPortrait({ sex: 'male', size: 64 })} height={50} width={50}/>
      </Avatar>
      <div className='flex flex-col gap-0 mt-2'>
        <span className='text-sm leading-2.5'>{athlete.firstname}</span>
        <h1 className='text-lg whitespace-break-spaces font-medium'>{athlete.lastname}</h1>
      </div>
      <p className='text-sm'>{faker.number.int({ max: 20})} / {faker.number.int({ max: 10 })} </p>

      <h1 
        className={cn(
          'absolute top-[50%] -translate-y-[50%] z-10 text-2xl opacity-70 w-full text-center font-medium',
          corner === 'a'
            ? '-left-[40%] -rotate-90 text-rankor/50'
            : '-right-[40%]  rotate-90 text-blue-600/50' 
        )}
      >
        {athlete.nickname}
      </h1>
    </div>
  )
}
