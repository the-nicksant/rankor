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

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={cn(
          'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
          'bg-card/50 ring-border ring',
          feature.cornerStyle,
        )}
      >
        <div className="text-rankor mb-3 text-[2rem]">
          <Icon />
        </div>
        <h2 className="text-foreground mb-2.5 text-2xl">{feature.title}</h2>
        <p className="text-muted-foreground text-base text-pretty">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-rankor/10 via-rankor to-rankor/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--rankor)/0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </motion.div>
  );
};

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
      className={'w-full'}
      id="features" 
      ref={ref}
    >
      <motion.div 
        initial="hidden"
        animate={controls}
        className="mx-6 max-w-7xl px-4 pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto"
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
        <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Center column */}
          <div className="order-[1] mb-6 self-center sm:order-[0] md:mb-0">
            <div className="bg-card text-foreground ring-border relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring">
              <span className="relative z-1 flex items-center gap-2">
                Funcionalidades
              </span>
              <span className="from-rankor/0 via-rankor to-rankor/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--rankor)/0.25)_0%,transparent_100%)]"></span>
            </div>
            <h2 className="text-foreground mb-2 text-center text-2xl sm:mb-2.5 md:text-[2rem]">
              Porque usar Rankor?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[18rem] text-center text-pretty">
              Rankor é melhor jeito de controlar seu evento sem perder a essência e autonomia.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
