'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Users, Shield, TrendingUp, Award } from 'lucide-react';

/**
 * Trust indicators displayed in social proof section
 * Icons + text to build credibility
 */
const proofItems = [
  {
    icon: Users,
    text: '100+ organizadores na lista de espera',
  },
  {
    icon: Award,
    text: 'Suporte para 8+ modalidades de luta',
  },
  {
    icon: Shield,
    text: 'Feito por quem entende de luta',
  },
  {
    icon: TrendingUp,
    text: 'Sistema de ranking justo e transparente',
  },
];

/**
 * Social Proof Section Component
 *
 * Builds immediate credibility with trust indicators
 *
 * Features:
 * - Horizontal layout with 4 proof points
 * - Subtle animations on scroll into view
 * - Icon + text format
 * - Minimal design that doesn't compete with hero
 *
 * Responsive:
 * - Desktop: 4 columns horizontal
 * - Tablet: 2x2 grid
 * - Mobile: Single column stack
 */
export default function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track if section is in view
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  return (
    <section
      id="social-proof"
      ref={sectionRef}
      className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">

        {/* Grid of proof items */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {proofItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-rankor/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                {/* Icon container with gradient background */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-rankor/20 to-rose-500/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-rankor" />
                </div>

                {/* Text */}
                <p className="text-sm font-medium text-foreground leading-tight">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
