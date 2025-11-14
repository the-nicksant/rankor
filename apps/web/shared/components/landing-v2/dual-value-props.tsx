'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/button';

/**
 * Benefits for event organizers
 */
const organizerBenefits = [
  'Profissionalize seu evento sem custo inicial',
  'Atraia mais atletas com ranking oficial',
  'Gere credibilidade para patrocinadores',
  'Economize tempo com automação',
  'Crie uma marca forte e memorável',
];

/**
 * Benefits for athletes
 */
const athleteBenefits = [
  'Histórico permanente de todas as lutas',
  'Ranking oficial por modalidade e categoria',
  'Perfil público para compartilhar conquistas',
  'Descubra novos eventos na sua região',
  'Construa um legado digital',
];

/**
 * Dual Value Props Section Component
 *
 * Shows value propositions for both target audiences side-by-side
 *
 * Features:
 * - 50/50 split layout
 * - Distinct branding for each audience
 * - Checkmark lists of benefits
 * - Separate CTAs for each side
 * - Vertical divider
 *
 * Responsive:
 * - Desktop: Side-by-side columns
 * - Mobile: Stacked vertically (organizers first)
 */
export default function DualValueProps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      id="dual-value-props"
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
            Rankor Funciona{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              para Todos
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Organizadores e atletas crescem juntos
          </p>
        </motion.div>

        {/* Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative">

          {/* Vertical Divider (desktop only) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {/* Left Side - Organizers */}
          <motion.div
            className="relative p-8 lg:p-12 lg:pr-16"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Card background */}
            <div className="relative h-full rounded-2xl bg-gradient-to-br from-rankor/5 via-transparent to-transparent border border-rankor/20 p-8 backdrop-blur-sm">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rankor/10 border border-rankor/20 mb-6">
                <span className="text-sm font-semibold text-rankor">
                  Para Organizadores
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-8">
                Eleve seu Evento ao Próximo Nível
              </h3>

              {/* Benefits List */}
              <ul className="space-y-4 mb-10">
                {organizerBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rankor/20 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-rankor" />
                    </div>
                    <span className="text-foreground leading-relaxed">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <a href="#early-access">
                  <Button
                    size="lg"
                    className="bg-rankor hover:bg-rankor/90 text-white shadow-lg shadow-rankor/30 w-full sm:w-auto"
                  >
                    Criar Meu Primeiro Evento
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--rankor)/0.1)_0%,transparent_60%)] pointer-events-none rounded-2xl" />
            </div>
          </motion.div>

          {/* Right Side - Athletes */}
          <motion.div
            className="relative p-8 lg:p-12 lg:pl-16"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Card background */}
            <div className="relative h-full rounded-2xl bg-gradient-to-br from-rose-500/5 via-transparent to-transparent border border-rose-500/20 p-8 backdrop-blur-sm">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                <span className="text-sm font-semibold text-rose-400">
                  Para Atletas
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-8">
                Construa seu Legado Digital
              </h3>

              {/* Benefits List */}
              <ul className="space-y-4 mb-10">
                {athleteBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="text-foreground leading-relaxed">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <a href="/athlete/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/5 w-full sm:w-auto"
                  >
                    Cadastrar como Atleta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--rose-500)/0.1)_0%,transparent_60%)] pointer-events-none rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
