'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Heart } from 'lucide-react';

/**
 * Footer navigation sections and links
 */
const footerSections = [
  {
    title: 'Produto',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Como Funciona', href: '#how-it-works' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Acesso Antecipado', href: '#early-access' },
    ],
  },
  // {
  //   title: 'Recursos',
  //   links: [
  //     { name: 'Documentação', href: '#' },
  //     { name: 'Suporte', href: 'mailto:suporte@rankor.app' },
  //     { name: 'Status', href: '#' },
  //     { name: 'Blog', href: '#' },
  //   ],
  // },
  {
    title: 'Empresa',
    links: [
      { name: 'Contato', href: 'https://wa.me/5511973727800' }
    ],
  },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/rankor.app',
    icon: Instagram,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/rankor-logo-white-h.png"
                width={140}
                height={40}
                alt="Rankor"
                className="h-auto"
              />
            </Link>

            <p className="text-muted-foreground mb-6 max-w-sm">
              A plataforma que profissionaliza eventos de luta amadora.
              Transforme confrontos em legados.
            </p>

   
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-rankor hover:text-white flex items-center justify-center transition-all duration-200 group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-rankor transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

            <p>
              © {currentYear} Rankor. Todos os direitos reservados.
            </p>

            <p className="flex items-center gap-2">
              Feito com{' '}
              <Heart className="w-4 h-4 text-rankor fill-rankor animate-pulse" />{' '}
              para a comunidade de luta
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
