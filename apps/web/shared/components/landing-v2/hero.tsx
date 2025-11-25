'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowRight, Sparkles, Trophy, BarChart3, Grid3x3, Zap } from 'lucide-react';
import { Button } from '@repo/ui/button';
import Image from 'next/image';

const featureBadges = [
  { icon: Grid3x3, text: 'Múltiplas Modalidades' },
  { icon: Trophy, text: 'Ranking Automatizado' },
  { icon: Zap, text: 'Gestão de Cards de Luta' },
  { icon: BarChart3, text: 'Páginas Públicas' },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);


  const handleScrollTo = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8"
    >
 
      <div className="absolute inset-0 -z-10 overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rankor/20 rounded-full blur-[120px] animate-pulse" />

    
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[100px]" />

        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">


          <motion.div
            className="flex flex-col space-y-8 text-center lg:text-left order-2 lg:order-1"
            style={{ y: contentY }}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          >

   
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rankor/10 border border-rankor/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-rankor" />
                <span className="text-sm font-medium text-foreground">
                  Plataforma Completa para Eventos de Luta
                </span>
              </div>
            </motion.div>

 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Transforme Eventos Amadores em{' '}
                <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent animate-gradient">
                  Competições Profissionais
                </span>
              </h1>
            </motion.div>


            <motion.p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              A plataforma completa para criar eventos, gerenciar lutas e ranquear atletas.{' '}
              <span className="text-foreground font-semibold">
                Chega de planilhas, WhatsApp e resultados perdidos.
              </span>
            </motion.p>


            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
    
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-rankor hover:bg-rankor/90 text-white shadow-lg shadow-rankor/30 text-base px-8 h-14"
                  onClick={() => handleScrollTo('#early-access')}
                >
                  Entrar na Lista de Acesso Antecipado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-border hover:border-rankor/50 hover:bg-rankor/5 text-base px-8 h-14"
                  onClick={() => handleScrollTo('#how-it-works')}
                >
                  Ver Como Funciona
                </Button>
              </motion.div>
            </motion.div>

        
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              {featureBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.text}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                  >
                    {/* Badge container */}
                    <div className="relative px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-rankor" />
                        <span className="text-sm font-medium text-foreground">
                          {badge.text}
                        </span>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rankor/0 via-rankor/5 to-rankor/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>


          <motion.div
            className="relative order-1 lg:order-2"
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative aspect-square max-w-[600px] mx-auto">
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rankor/30 via-rose-500/20 to-transparent blur-3xl -z-10 scale-110" />
                <div className="w-full h-full bg-gradient-to-br from-card via-card to-muted flex items-start justify-start">
                  <Image src={'/fighters.jpg'} alt='Main Screenshot' width={500} height={300} className='object-cover h-full w-full scale-110 pointer-events-none'/>
                </div>
              </div>

              <Image 
                src={'/screenshots/ranking.png'}
                width={350}
                height={450}
                alt='ranking'
                className='absolute -bottom-14 -left-10 pointer-events-none'
              />

              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-rankor to-rose-500 shadow-lg shadow-rankor/30 flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-xl bg-gradient-to-br from-rose-400 to-red-600 shadow-lg flex items-center justify-center"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <BarChart3 className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - bottom center */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => handleScrollTo('#social-proof')}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs text-muted-foreground font-medium">
            Deslize para baixo
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-2 bg-rankor rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
