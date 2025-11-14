'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { FileText, Ghost, Users, TrendingDown } from 'lucide-react';

/**
 * Problem cards highlighting organizer pain points
 * Each card has icon, title, and description
 */
const problems = [
  {
    icon: FileText,
    title: 'Caos na Gestão',
    description:
      'Inscrições por WhatsApp, cards em papel, dados espalhados. Seu evento merece profissionalismo.',
  },
  {
    icon: Ghost,
    title: 'Sem Histórico para os Atletas',
    description:
      'Competidores lutam, mas não têm registro. Sem ranking, sem legado, sem motivo para voltar.',
  },
  {
    icon: Users,
    title: 'Dificuldade em Atrair Talentos',
    description:
      'Atletas buscam eventos que constroem carreira. Sem estrutura, você perde os melhores.',
  },
  {
    icon: TrendingDown,
    title: 'Marca Fraca',
    description:
      'Sem dados e profissionalismo, patrocinadores não levam seu evento a sério.',
  },
];

/**
 * Problems Section Component
 *
 * Agitates pain points for event organizers
 * Makes them feel understood and primes them for the solution
 *
 * Features:
 * - 2x2 grid of problem cards
 * - Hover effects with glow
 * - Stagger animation on scroll
 * - Gradient accents matching brand
 *
 * Responsive:
 * - Desktop: 2x2 grid
 * - Tablet: 2 columns
 * - Mobile: Single column stack
 */
export default function Problems() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track if section is in view
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      id="problems"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Seu Evento Merece Mais que{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              Planilhas e Posts Esquecidos
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Reconheça o problema. Rankor é a solução.
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;

            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Card container */}
                <div className="relative h-full p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-rankor/30 transition-all duration-300 overflow-hidden">

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-rankor/20 to-rose-500/10">
                      <Icon className="w-8 h-8 text-rankor" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Decorative gradient line at bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-rankor/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                  {/* Subtle radial glow effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--rankor)/0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rankor/0 via-rankor/5 to-rankor/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
