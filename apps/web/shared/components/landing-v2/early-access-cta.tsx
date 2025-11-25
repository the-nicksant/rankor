'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { toast } from 'sonner';

export default function EarlyAccessCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'organizador' as 'organizador' | 'atleta',
    location: '',
  });


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const response = await res.json()
      
      if(response.success){
        setIsSubmitted(true);
      }
    } catch (error) {
      toast.error("Ocorreu um problema ao salvar sua inscrição")
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <section
      id="early-access"
      ref={sectionRef}
      className="relative w-full py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-rankor/5 to-background -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--rankor)/0.15)_0%,transparent_50%)] -z-10" />

      <div className="max-w-4xl mx-auto">

        {/* Show success message if submitted */}
        {isSubmitted ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex p-6 rounded-full bg-green-500/10 border-2 border-green-500/30">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Você está na lista! 🎉
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Obrigado por se inscrever. Enviaremos um email assim que abrirmos o acesso.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="border-2"
            >
              Inscrever outro email
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Section Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rankor/10 border border-rankor/20 mb-6">
                <Sparkles className="w-4 h-4 text-rankor" />
                <span className="text-sm font-semibold text-rankor">
                  Vagas Limitadas
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Seja um dos Primeiros.{' '}
                <span className="bg-gradient-to-r from-rankor via-rose-400 to-rose-300 bg-clip-text text-transparent">
                  Entre na Lista.
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Organizadores que entrarem agora terão{' '}
                <span className="text-foreground font-semibold">
                  acesso gratuito vitalício
                </span>{' '}
                ao plano básico.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-10 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Decorative gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-rankor/10 via-transparent to-rose-500/10 rounded-2xl -z-10 blur-xl" />

              <div className="space-y-6">

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="h-12 text-base bg-background/50 border-border/50 focus:border-rankor"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="h-12 text-base bg-background/50 border-border/50 focus:border-rankor"
                  />
                </div>

                {/* Type Field (Radio buttons styled as buttons) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Você é...
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.type === 'organizador'
                          ? 'border-rankor bg-rankor/10'
                          : 'border-border/50 bg-background/30 hover:border-rankor/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="organizador"
                        checked={formData.type === 'organizador'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-semibold">Organizador</span>
                    </label>

                    <label
                      className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.type === 'atleta'
                          ? 'border-rankor bg-rankor/10'
                          : 'border-border/50 bg-background/30 hover:border-rankor/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="atleta"
                        checked={formData.type === 'atleta'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-semibold">Atleta</span>
                    </label>
                  </div>
                </div>

                {/* location Field (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">
                    Cidade/Estado (opcional)
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo, SP"
                    className="h-12 text-base bg-background/50 border-border/50 focus:border-rankor"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-14 text-base font-semibold bg-rankor hover:bg-rankor/90 text-white shadow-lg shadow-rankor/30"
                >
                  {isSubmitting ? 'Enviando...' : 'Garantir Minha Vaga'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Privacy note */}
              <p className="text-xs text-muted-foreground text-center mt-6">
                Não enviaremos spam. Seus dados estão seguros conosco.
              </p>
            </motion.form>
          </>
        )}
      </div>
    </section>
  );
}
