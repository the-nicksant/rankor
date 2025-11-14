'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
} from 'motion/react';

import { Button } from '@repo/ui/button';
import { ArrowRight } from 'lucide-react';

import { cn } from '@repo/ui/cn'
import Image from 'next/image';

export default function LucyHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);


  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const GradientText = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span
      className={cn(
        'from-rankor dark:from-rankor bg-gradient-to-r via-rose-400 to-rose-300 bg-clip-text text-transparent dark:via-rose-300 dark:to-red-400',
        className,
      )}
    >
      {children}
    </span>
  );

  return (
    <div
      ref={heroRef}
      className="bg-radial-[at_50%_-50%] from-red-300/50 from-5% via-rankor/40 via-30% to-background to-75% flex justify-center flex-col lg:flex-row items-center relative min-h-screen w-full overflow-hidden py-16"
    >
      <motion.div
        className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8"
        style={{ y: contentY }}
      >
        <div className="grid items-center justify-center gap-16 md:grid-cols-2">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.7,
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate={controls}
            className="flex flex-col text-center md:text-left"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-foreground mb-6 text-5xl leading-tight font-bold tracking-tight md:text-5xl lg:text-7xl">
                Eleve seu evento <br />
                Crie <GradientText>legados.</GradientText>
              </h2>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-muted-foreground mb-8 text-lg leading-relaxed"
            >
             A plataforma que profissionaliza eventos de luta amadora. Gerencie confrontos, ranqueie atletas e construa uma marca que seus competidores {' '}
              <span className="text-foreground font-semibold">
                nunca esquecerão.
              </span>
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap justify-center gap-4 md:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button className="relative">
                  Estruture seu evento gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-background/50 absolute inset-0 -z-10 rounded-full backdrop-blur-sm"></div>
                <Button
                  variant="outline"
                  className="transition-all duration-300 border-2"
                >
                  Descubra o que podemos fazer 
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              {['Múltiplas Modalidades', 'Cronogramas', 'Resultados em tempo real', 'Matchmaking automático'].map(
                (feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="text-foreground relative rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                  >
                    <div className="border-rankor/10 bg-background/80 dark:bg-background/30 absolute inset-0 rounded-full border backdrop-blur-md dark:border-white/5"></div>
                    <div className="via-rankor/20 dark:via-rankor/30 absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500/0 to-rose-500/0 dark:from-blue-500/0 dark:to-indigo-500/0"></div>

                    <span className="relative z-10">{feature}</span>
                  </motion.div>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div className='mt-12 mx-8 lg:mt-0 lg:mx-0 lg:absolute -bottom-10 right-0 lg:translate-x-1/4'>
        <Image src="/fighters.jpg" alt="Hero Image" width={1000} height={1000} />
      </motion.div>
    </div>
  );
}
