'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CalendarPlus, Users2, Trophy } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: CalendarPlus,
    title: 'Crie seu Evento',
    description:
      'Configure nome, data, local e modalidades. Defina categorias de peso personalizadas ou use as padrões.',
    color: 'from-rankor to-rose-500',
  },
  {
    number: 2,
    icon: Users2,
    title: 'Monte o Card de Lutas',
    description:
      'Selecione atletas inscritos e monte lutas com arrastar e soltar. Revise e publique o card.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    number: 3,
    icon: Trophy,
    title: 'Gerencie Resultados',
    description:
      'Registre resultados ao vivo. Rankings atualizam automaticamente. Atletas compartilham nas redes.',
    color: 'from-pink-500 to-red-400',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/20"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Como Funciona?{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              Simples Assim.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece a profissionalizar seus eventos em 3 passos
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">

          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-rankor/20 via-rose-500/20 to-pink-500/20" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  className="relative flex flex-col items-center text-center lg:items-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >

                  {/* Step Number Circle */}
                  <motion.div
                    className="relative z-10 mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} shadow-lg shadow-rankor/30 flex items-center justify-center relative`}>
                      {/* Pulse animation ring */}
                      <div className="absolute inset-0 rounded-full bg-rankor/20 animate-ping" />

                      {/* Step number */}
                      <span className="relative text-3xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Icon */}
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-rankor/10 to-rose-500/5 border border-rankor/20">
                    <Icon className="w-10 h-10 text-rankor" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                    {step.description}
                  </p>

                  {/* Connecting arrow (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden mt-8 mb-4">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-rankor/50 to-transparent mx-auto" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Pronto para começar?
          </p>
          <a
            href="#early-access"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-rankor hover:bg-rankor/90 text-white font-semibold shadow-lg shadow-rankor/30 transition-all duration-200 hover:scale-105"
          >
            Entrar na Lista de Acesso Antecipado
            <Trophy className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
