'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@repo/ui/button';

/**
 * Product screenshots/mockups to showcase in carousel
 * Each item has title, description, and placeholder for image
 */
const screenshots = [
  {
    title: 'Criação de Eventos Intuitiva',
    description: 'Configure seu evento em minutos com nosso wizard guiado',
    imageAlt: 'Event Creation Wizard Screenshot',
  },
  {
    title: 'Gestão de Cards de Luta',
    description: 'Arraste e solte para organizar lutas, visualize comparações de atletas',
    imageAlt: 'Fight Card Management Screenshot',
  },
  {
    title: 'Página Pública do Evento',
    description: 'Cada evento ganha uma página profissional para compartilhar',
    imageAlt: 'Public Event Page Screenshot',
  },
  {
    title: 'Perfil de Atleta com Ranking',
    description: 'Histórico completo, ranking atualizado e legado digital',
    imageAlt: 'Athlete Profile Screenshot',
  },
  {
    title: 'Dashboard com Métricas',
    description: 'Acompanhe inscrições, lutas e engajamento em tempo real',
    imageAlt: 'Dashboard Screenshot',
  },
];

/**
 * Solution Preview Section Component
 *
 * Shows the product in action with screenshot carousel
 *
 * Features:
 * - Image carousel with prev/next controls
 * - Dot navigation
 * - Auto-play support (commented out for now)
 * - Smooth transitions with AnimatePresence
 * - Browser mockup frame
 *
 * Responsive:
 * - Desktop: Large centered carousel
 * - Mobile: Full-width carousel with touch support
 */
export default function SolutionPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Track current screenshot index
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Navigate to next screenshot
   */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  /**
   * Navigate to previous screenshot
   */
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  /**
   * Navigate to specific screenshot by index
   */
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentScreenshot = screenshots[currentIndex];

  return (
    <section
      id="solution-preview"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/20"
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
            A Plataforma que{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              Seu Evento Precisa
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja como a Rankor funciona na prática
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >

          {/* Browser Mockup Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">

            {/* Browser toolbar */}
            <div className="h-12 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 ml-4 h-6 bg-background/50 rounded px-3 flex items-center">
                <span className="text-xs text-muted-foreground">
                  rankor.app/{currentScreenshot.imageAlt.toLowerCase().replace(/ /g, '-')}
                </span>
              </div>
            </div>

            {/* Screenshot display area */}
            <div className="relative aspect-video bg-background overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Placeholder for actual screenshot */}
                  {/* Replace this div with <Image> component when you have real screenshots */}
                  <div className="w-full h-full bg-gradient-to-br from-card via-muted/30 to-card flex items-center justify-center p-8">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-2xl bg-rankor/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-rankor">
                          {currentIndex + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {currentScreenshot.title}
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Screenshot Placeholder - {currentScreenshot.imageAlt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-rankor hover:border-rankor text-foreground hover:text-white transition-all duration-200 shadow-lg"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-rankor hover:border-rankor text-foreground hover:text-white transition-all duration-200 shadow-lg"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption below screenshot */}
            <div className="p-6 bg-muted/30 border-t border-border/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {currentScreenshot.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentScreenshot.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-rankor w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
