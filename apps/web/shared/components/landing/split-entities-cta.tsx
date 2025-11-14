import { Button } from '@repo/ui/button'
import { MicVocal, Trophy } from 'lucide-react'
import React from 'react'

export const SplitEntitiesCTA = () => {
  return (
    <div className='flex items-center justify-center w-full py-24'>
      <div className='flex items-center md:items-start flex-col md:flex-row max-w-7xl w-full'>

        <section className='flex flex-col items-center justify-center p-8 text-center flex-1'>
          <div className='rounded-lg p-4 border-2 border-white mb-4 bg-rankor/90'> 
            <MicVocal size={32}/>
          </div>

          <h2 className='text-xl my-2'>
            Você organiza eventos de luta?
          </h2>
          <p className='text-muted-foreground text-sm max-w-[60%]'>
            Descubra como o Rankor transforma seu evento em uma experiência profissional que atletas desejam.
          </p>
          <Button variant={'link'} className='mt-4'>
            Explorar para Organizadores
          </Button>
        </section>
        <div className='md:block h-[300px] w-[2px] bg-rankor/20 shadow-lg shadow-white'/>
        <section className='flex flex-col items-center justify-center p-8 text-center flex-1'>
          <div className='rounded-lg p-4 border-2 border-white mb-4 bg-rankor/90'>
            <Trophy size={32}/>
          </div>

          <h2 className='text-xl my-2'>
            Você compete em eventos?
          </h2>
          <p className='text-muted-foreground text-sm max-w-[60%]'>
          Crie seu perfil, rastreie seu cartel e suba no ranking oficial. Seu legado começa aqui.
          </p>
          <Button variant={'link'} className='mt-4'>
            Explorar para Organizadores
          </Button>
        </section>
      </div>
    </div>
  )
}
