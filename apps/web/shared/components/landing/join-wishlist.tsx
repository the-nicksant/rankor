'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'motion/react'
import { Button } from '@repo/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export const JoinWishList = () => {
  const ref = useRef(null)

  const isInView = useInView(ref, { once: false, amount: 0.4 });
  const controls = useAnimation();

   useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  
  return (
    <div
      id="problems"
      ref={ref}
      className='flex items-center justify-center flex-col w-full py-24 px-8 lg:px-0' 
    >
      <motion.div 
        initial="hidden"
        animate={controls}
        ref={ref}
        variants={{
          hidden: {
            opacity: 0,
            y: '100%',
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              type: 'tween',
              stiffness: 100,
            },
          }
        }} 
        className='w-full p-8 flex items-center justify-center flex-col bg-gradient-to-t from-rankor/30 via-rankor/20 to-rankor/50 via-40% to-100% min-h-[600px]'
      >
        <div className='w-full max-w-7xl p-8 flex items-center justify-center text-center flex-col gap-12'>
          <Image src="/rankor-white.png" height={120} width={120} alt='Rankor' />

          <header className='lg:max-w-[60%]'>
            <h1 className='text-5xl font-semibold'>
              Pronto para Profissionalizar seu Evento?
            </h1>
            <p className='text-muted-foreground text-base mt-4'>Milhares de atletas estão esperando por uma plataforma como esta. <br />
            Seja o organizador que oferece isso.</p>
          </header>


          <Button variant={'secondary'} size={'lg'} className='mt-12' icon={<ArrowRight />}>
            Entrar na lista de espera
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
