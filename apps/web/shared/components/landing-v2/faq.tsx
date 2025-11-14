'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

/**
 * FAQ items - questions and answers to address common objections
 */
const faqs = [
  {
    question: 'Quanto custa para usar a Rankor?',
    answer:
      'Estamos em fase de early access. Primeiros usuários terão acesso gratuito vitalício ao plano básico. Planos premium com funcionalidades avançadas virão depois do lançamento oficial.',
  },
  {
    question: 'Quais modalidades são suportadas?',
    answer:
      'Atualmente suportamos Boxing, MMA, Jiu-Jitsu, Muay Thai, Kickboxing, Judo, Karate, Taekwondo e Wrestling. Podemos adicionar mais modalidades sob demanda dos organizadores.',
  },
  {
    question: 'Como funciona o sistema de ranking?',
    answer:
      'Os pontos são calculados baseados em vitória/derrota, método de vitória (KO, decisão, finalização, etc.) e força do oponente. O sistema é transparente, justo e atualizado automaticamente após cada luta.',
  },
  {
    question: 'Preciso de conhecimento técnico para usar?',
    answer:
      'Não! A plataforma foi projetada para ser extremamente intuitiva. Se você consegue usar WhatsApp, vai conseguir usar Rankor. Temos um wizard guiado que te ajuda em cada passo.',
  },
  {
    question: 'Os atletas também podem se cadastrar?',
    answer:
      'Sim! Atletas criam perfis gratuitos, visualizam eventos disponíveis, se inscrevem em competições e acompanham seus rankings e histórico de lutas.',
  },
  {
    question: 'E se eu já tenho um evento agendado?',
    answer:
      'Perfeito! Você pode criar o evento na plataforma imediatamente e começar a usar todas as funcionalidades. É possível importar dados de atletas já inscritos.',
  },
  {
    question: 'Como os atletas veem os resultados?',
    answer:
      'Cada evento tem uma página pública automática. Após os resultados serem registrados, atletas recebem links para compartilhar nas redes sociais com seus cartéis atualizados.',
  },
  {
    question: 'Tem aplicativo mobile?',
    answer:
      'Estamos desenvolvendo apps nativos para iOS e Android. Por enquanto, a plataforma web é totalmente responsiva e funciona perfeitamente em celulares e tablets.',
  },
];

/**
 * FAQ Section Component
 *
 * Accordion-style FAQ to address common objections
 *
 * Features:
 * - Accordion with expand/collapse
 * - Only one item open at a time
 * - Plus/minus icon animation
 * - Smooth transitions
 * - Hover effects
 *
 * Responsive:
 * - Desktop: Large centered column
 * - Mobile: Full-width, larger touch targets
 */
export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Track which FAQ item is currently open (null = all closed)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Toggle FAQ item open/closed
   */
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/20"
    >
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa saber sobre a Rankor
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                {/* FAQ Item Container */}
                <div
                  className={`relative bg-card/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? 'border-rankor/30 shadow-lg shadow-rankor/10'
                      : 'border-border/50 hover:border-rankor/20'
                  }`}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4 focus:outline-none group"
                  >
                    {/* Question Text */}
                    <span
                      className={`text-lg font-semibold transition-colors ${
                        isOpen ? 'text-rankor' : 'text-foreground group-hover:text-rankor'
                      }`}
                    >
                      {faq.question}
                    </span>

                    {/* Plus/Minus Icon */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'bg-rankor text-white rotate-180'
                          : 'bg-muted text-foreground group-hover:bg-rankor/10 group-hover:text-rankor'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Answer - Animated Expand/Collapse */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom gradient line (visible when open) */}
                  {isOpen && (
                    <div className="h-px bg-gradient-to-r from-transparent via-rankor/50 to-transparent" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom help text */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            Ainda tem dúvidas?{' '}
            <a
              href="mailto:contato@rankor.app"
              className="text-rankor hover:underline font-medium"
            >
              Fale com nosso time
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
