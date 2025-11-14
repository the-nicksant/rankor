"use client"

import { cn } from '@repo/ui/cn';
import {
  Trophy,
  User,
  LucideIcon,
  Swords,
  QrCode,
  LayoutList,
  BarChart3,
} from 'lucide-react';

import { motion, useAnimation, useInView } from 'motion/react'
import { useEffect, useRef } from 'react';
import MagicBento from '../magic-bento';


type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: 'left' | 'right';
  cornerStyle?: string;
};

const leftFeatures: FeatureItem[] = [
  {
    icon: QrCode,
    title: 'Páginas de Evento Profissionais',
    description:
      'Gere uma página pública e um QR Code para cada evento. Divulgue seus cards de luta com uma aparência moderna e profissional instantaneamente.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: LayoutList,
    title: 'Cards de Luta Dinâmicos',
    description:
      'Monte e organize o card de lutas do seu evento com uma interface de arrastar e soltar.',
    position: 'left',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: BarChart3,
    title: 'Dashboard com Métricas',
    description:
      'Acompanhe dados essenciais em tempo real: número de inscritos, lutas realizadas e engajamento dos atletas.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-tr-[2px]',
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Swords,
    title: 'Gestão de Eventos Centralizada',
    description:
      'Crie e administre seus eventos, categorias de peso e inscrições em um painel único e intuitivo.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: Trophy,
    title: 'Ranking Automatizado',
    description:
      'Nosso sistema de pontuação atualiza o ranking por categoria e academia após cada luta.',
    position: 'right',
    cornerStyle: 'sm:translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: User,
    title: 'Perfis de Atleta e Histórico',
    description:
      'Cada competidor ganha uma página pública com seu cartel, histórico de lutas e posição no ranking.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-tl-[2px]',
  },
];

export default function Feature() {
  const ref = useRef(null)

  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

   useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [isInView, controls]);

  return (
    <section 
      className={'w-full flex items-center justify-center px-8 lg:p-0'}
      id="features" 
      ref={ref}
    >
      <motion.div 
        initial="hidden"
        animate={controls}
        className="max-w-7xl w-full flex items-center jusitfy-center flex-col"
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
            },
          },
        }}
      >
        <header className='pb-12 flex items-center justify-center flex-col'>
          <h1 className='text-3xl lg:text-5xl font-semibold max-w-[60%] text-center'>
            A Estrutura que seu Evento Precisa
          </h1>
          <p className='max-w-[500px] text-muted-foreground mt-6 text-center'>
            Tudo que você precisa para profissionalizar seus eventos, em um só lugar.
          </p>
        </header>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-6 lg:grid-rows-2 w-full flex-1'>
          <div className='relative col-span-1 lg:col-span-4 w-full h-[600px] border border-border rounded-xl flex flex-col gap-12 flex-1 p-6 hover:'>
            <header className='pb-8 flex items-center justify-center flex-col'>
              <h1 className='text-2xl font-semibold max-w-[60%] text-center'>
                Gestão de Eventos Centralizada
              </h1>
              <p className='max-w-[500px] text-muted-foreground mt-2 text-center text-base'>
                Crie e administre seus eventos, categorias de peso e inscrições em um painel único e intuitivo.
              </p>
            </header>
          </div>

          <div className='relative col-span-1 lg:col-span-2 w-full h-[600px] border border-border rounded-xl flex flex-col gap-12 flex-1 p-6'>
            <header className='pb-8 flex items-center justify-center flex-col'>
              <h1 className='text-2xl font-semibold max-w-[60%] text-center'>
                Ranking Automatizado
              </h1>
              <p className='max-w-[500px] text-muted-foreground mt-2 text-center text-base'>
                Nosso sistema de pontuação atualiza o ranking por categoria após cada luta. Gere rivalidade saudável.
              </p>
            </header>
          </div>

          <div className='relative col-span-1 lg:col-span-3 w-full h-[500px] border border-border rounded-xl flex flex-col gap-12 flex-1 p-6'>
            <header className='pb-8 flex items-center justify-center flex-col'>
              <h1 className='text-2xl font-semibold max-w-[60%] text-center'>
                Perfis de Atleta e Histórico
              </h1>
              <p className='max-w-[500px] text-muted-foreground mt-2 text-center text-base'>
                Cada competidor ganha uma página pública com seu cartel e posição no ranking. Um legado digital.
              </p>
            </header>
          </div>

          <div className='relative col-span-1 lg:col-span-3 w-full h-[500px] border border-border rounded-xl flex flex-col gap-12 flex-1 p-6'>
            <header className='pb-8 flex items-center justify-center flex-col'>
              <h1 className='text-2xl font-semibold max-w-[60%] text-center'>
                Páginas de Evento Profissionais
              </h1>
              <p className='max-w-[500px] text-muted-foreground mt-2 text-center text-base'>
                Gere uma página pública e um QR Code para cada evento. Divulgue com aparência moderna instantaneamente.
              </p>
            </header>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
