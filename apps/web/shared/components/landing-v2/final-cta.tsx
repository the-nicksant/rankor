'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/button';
import Image from 'next/image';

/**
 * Final CTA Section Component
 *
 * Last conversion opportunity before footer
 *
 * Features:
 * - Bold gradient background
 * - Large prominent CTA button
 * - Simple, focused messaging
 * - Minimal distractions
 *
 * Responsive:
 * - Desktop: Centered content with large button
 * - Mobile: Stacked layout, full-width button
 */
export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  /**
   * Smooth scroll to early access form
   */
  const scrollToEarlyAccess = () => {
    const element = document.querySelector('#early-access');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background with strong gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rankor/30 via-rose-500/20 to-rankor/30 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--rankor)/0.2)_0%,transparent_70%)] -z-10" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >

          {/* Logo/Icon */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rankor to-rose-500 shadow-2xl shadow-rankor/40 flex items-center justify-center">
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-rankor/30 animate-ping" />

              {/* Logo or icon - replace with actual logo if needed */}
              <Image
                src="/rankor-white.png"
                width={80}
                height={80}
                alt="Rankor"
                className="relative z-10"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pronto para Profissionalizar{' '}
            <span className="bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
              seu Próximo Evento?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            className="text-xl text-foreground/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Junte-se a centenas de organizadores que já estão na lista de espera.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={scrollToEarlyAccess}
              className="bg-white hover:bg-white/90 text-rankor font-bold text-lg px-10 h-16 shadow-2xl shadow-black/20 border-4 border-white/20"
            >
              Entrar na Lista de Acesso Antecipado
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            className="text-sm text-foreground/70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            ✓ Sem compromisso • ✓ Acesso gratuito vitalício para early adopters
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
