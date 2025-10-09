import React from 'react'
import { Avatar, AvatarImage } from '@repo/ui/avatar'
import { cn } from '@repo/ui/cn'
import { Input } from '@repo/ui/input'
import { Search } from 'lucide-react'

export const FightsTab = () => {
  return (
    <div className='bg-card p-6 rounded-lg border'>
      <header className='pb-6'>
        <h3 className='font-semibold text-lg'>Lutas</h3>
        <p className='text-muted-foreground text-sm'>Chaveamento e lutas serão exibidos aqui.</p>
      </header>

      <div className='flex flex-col gap-2'>
        <header className='flex flex-col items-center md:justify-between py-2'>
          <Input 
            icon={<Search size={14}/>}
            placeholder='Pesquisar lutas'
          />
        </header>
        
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
        <FightCard />
      </div>
    </div>
  )
}

export const FightCard = () => {
  
  return (
    <div className='w-full max-h-[250px] flex items-center border border-border relative group transition-all cursor-pointer hover:border-white'>
      <div className='absolute top-0 left-0 bg-white text-black text-xs px-2 py-1 rounded-br-md z-20'>
        Boxe
      </div>

      <div className='absolute top-0 right-0 bg-rankor text-white text-xs px-2 py-1 rounded-bl-md z-20'>
        Amador
      </div>

      <span className='absolute top-2 left-[50%] -translate-x-[50%] text-white italic uppercase text-xs text-center z-20'>
        Meio pesado
      </span>

      {/* athlete a */}
      <AthleteSide corner='a'/>

      <div className='text-rankor text-sm absolute selft-center left-[50%] -translate-x-[50%] z-10'>
        VS
      </div>

      {/* athlete b */}
      <AthleteSide corner='b'/>

      
    </div>
  )
}

const AthleteSide = ({ corner }: { corner: 'a' | 'b' }) => {
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
        <AvatarImage src='https://ssl.gstatic.com/onebox/media/sports/photos/ufc/3546_feE7sQ_96x96.png' height={50} width={50}/>
      </Avatar>
      <div className='flex flex-col gap-0 mt-2'>
        <span className='text-sm leading-2.5'>Alex</span>
        <h1 className='text-lg whitespace-break-spaces font-medium'>Pereira</h1>
      </div>
      <p className='text-sm'>23 / 2 </p>

      <h1 
        className={cn(
          'absolute top-[50%] -translate-y-[50%] z-10 text-2xl opacity-70 w-full text-center font-medium',
          corner === 'a'
            ? '-left-[40%] -rotate-90 text-rankor/50'
            : '-right-[40%]  rotate-90 text-blue-600/50' 
        )}
      >
        BROCADOR
      </h1>
    </div>
  )
}

