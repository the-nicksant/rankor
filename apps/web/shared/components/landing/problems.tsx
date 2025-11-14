"use client"

import React, { useEffect, useRef } from 'react'

import { motion, useAnimation, useInView } from 'motion/react'
import { FileText, Ghost, LucideIcon, TrendingDown, Users } from 'lucide-react'
import { cn } from '@repo/ui/cn'

export const Problems = () => {
  const ref = useRef<HTMLDivElement>(null);

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
            y: -50,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
            },
          }
        }} 
        className='w-full max-w-7xl py-12 flex items-center flex-col'
      >
        <h1 className='text-3xl lg:text-5xl font-semibold max-w-[60%] text-center'>
          Seu evento merece mais que planilhas e posts esquecidos.
        </h1>
        <p className='max-w-[500px] text-muted-foreground mt-6'>
          Reconheça o problema. Rankor é a solução.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-8'>
          <FeatureCard 
            feature={{
              title: "Caos na gestão",
              description: "Lutas anotadas em papel, inscrições por WhatsApp, dados espalhados. Chega de amadorismo.",
              icon: FileText
            }}
          />
          <FeatureCard 
            feature={{
              title: "Lutas Fantasmas",
              description: "Cada confronto termina no apagar das luzes. O histórico dos atletas se perde no tempo.",
              icon: Ghost
            }}
          />
          <FeatureCard 
            feature={{
              title: "Dificuldade em Atrair Talentos",
              description: "Sem uma estrutura profissional, atletas não veem seu evento como um lugar para construir legado.",
              icon: Users
            }}
          />
          <FeatureCard 
            feature={{
              title: "Marca Fraca",
              description: "Sem dados e profissionalismo, é difícil atrair patrocinadores e público.",
              icon: TrendingDown
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: 'left' | 'right';
  cornerStyle?: string;
};

const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={cn(
          'relative rounded-2xl px-4 pt-4 pb-4 text-sm h-full',
          'bg-card/50 ring-border ring',
          feature.cornerStyle,
        )}
      >
        <div className="text-rankor mb-3 text-[2rem]">
          <Icon />
        </div>
        <h2 className="text-foreground mb-2.5 text-xl lg:text-2xl">{feature.title}</h2>
        <p className="text-muted-foreground text-base text-pretty">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-rankor/10 via-rankor to-rankor/0 absolute -bottom-px left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--rankor)/0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </motion.div>
  );
};
