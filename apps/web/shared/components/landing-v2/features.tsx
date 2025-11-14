'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Swords, Trophy, User, QrCode, LayoutList, BarChart3, ArrowRight } from 'lucide-react';
import Image from 'next/image';

/**
 * Feature items for the modern layout
 * Each feature has an icon, title, description, and will have an image mockup
 */
const features = [
  {
    icon: Swords,
    title: 'Gestão de Eventos Centralizada',
    description:
      'Crie eventos, configure categorias de peso, gerencie inscrições - tudo em um único painel intuitivo.',
    imageAlt: 'Event Management Dashboard',
  },
  {
    icon: LayoutList,
    title: 'Cards de Luta Dinâmicos',
    description:
      'Monte e reorganize lutas com arrastar e soltar. Visualize comparações antes de confirmar.',
    imageAlt: 'Fight Card Builder',
  },
  {
    icon: Trophy,
    title: 'Ranking Automatizado',
    description:
      'Sistema de pontos atualiza após cada luta. Por modalidade, categoria e academia.',
    imageAlt: 'Ranking System',
  },
  {
    icon: QrCode,
    title: 'Páginas de Evento Profissionais',
    description:
      'Cada evento ganha página pública com QR Code. Compartilhe instantaneamente.',
    imageAlt: 'Public Event Page',
  },
  {
    icon: User,
    title: 'Perfis de Atleta Completos',
    description:
      'Histórico completo (cartel), ranking e legado digital para cada competidor.',
    imageAlt: 'Athlete Profile',
  },
  {
    icon: BarChart3,
    title: 'Resultados em Tempo Real',
    description:
      'Registre resultados ao vivo. Atletas e público acompanham atualizações instantâneas.',
    imageAlt: 'Live Results',
  },
];

/**
 * Features Section Component - REDESIGNED
 *
 * Modern, visually striking features showcase
 *
 * Features:
 * - Bento-style grid with varying sizes
 * - Image mockups for each feature
 * - Consistent red/dark theme
 * - Advanced hover animations with 3D tilt effect
 * - Glassmorphism overlays
 * - Smooth reveal animations
 *
 * Responsive:
 * - Desktop: Complex bento grid
 * - Mobile: Single column with equal heights
 */
export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-rankor/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Funcionalidades que{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              Fazem a Diferença
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa em uma plataforma completa e intuitiva
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Feature 1 - Large (spans 2 columns on desktop) */}
          <motion.div
            className="lg:col-span-2 group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[0]!}
              size="large"
            />
          </motion.div>

          {/* Feature 2 - Small */}
          <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[1]!}
              size="small"
            />
          </motion.div>

          {/* Feature 3 - Small */}
          <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[2]!}
              size="small"
            />
          </motion.div>

          {/* Feature 4 - Large (spans 2 columns on desktop) */}
          <motion.div
            className="lg:col-span-2 group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[3]!}
              size="large"
            />
          </motion.div>

          {/* Feature 5 - Large (spans 2 columns on desktop) */}
          <motion.div
            className="lg:col-span-2 group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[4]!}
              size="large"
            />
          </motion.div>

          {/* Feature 6 - Small */}
          <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <FeatureCard
              feature={features[5]!}
              size="small"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  size,
}: {
  feature: typeof features[0];
  size: 'large' | 'small';
}) {
  const Icon = feature.icon;
  const cardRef = useRef<HTMLDivElement>(null);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className={`relative h-full ${size === 'large' ? 'min-h-[400px]' : 'min-h-[320px]'} rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ease-out hover:border-rankor/30 hover:shadow-2xl hover:shadow-rankor/20 group cursor-pointer`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
    
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-background">
        <div className="w-full h-full flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-500">
          <Icon className={`${size === 'large' ? 'w-32 h-32' : 'w-24 h-24'} text-rankor/20`} />
        </div>
      </div>

     
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-rankor/0 via-rankor/5 to-rankor/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      
      <div className="relative h-full flex flex-col justify-end p-8 z-10">


        <div className="absolute top-6 right-6">
          <div className="p-3 rounded-xl bg-rankor/10 backdrop-blur-md border border-rankor/20 group-hover:bg-rankor/20 group-hover:scale-110 transition-all duration-300">
            <Icon className="w-6 h-6 text-rankor" />
          </div>
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-rankor transition-colors duration-300">
          {feature.title}
        </h3>


        <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-lg">
          {feature.description}
        </p>

  
        <div className="flex items-center gap-2 text-sm font-medium text-rankor opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Saiba mais
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>


        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rankor to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-rankor/0 group-hover:ring-rankor/30 transition-all duration-300 pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}
