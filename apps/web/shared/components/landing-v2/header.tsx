'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@repo/ui/button';

/**
 * Navigation items displayed in the header
 * - name: Display text for the nav item
 * - href: Link destination (anchor or route)
 */
const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'Como Funciona', href: '#how-it-works' },
  { name: 'FAQ', href: '#faq' },
];

/**
 * Header Component
 *
 * Modern, responsive navigation header with:
 * - Glassmorphism effect on scroll
 * - Smooth scroll to anchor sections
 * - Mobile-friendly hamburger menu
 * - Sticky positioning
 *
 * Behavior:
 * - Transparent initially, blurred background appears on scroll
 * - Mobile menu slides in from right
 * - All animations use Framer Motion for smoothness
 */
export default function Header() {
  // Track scroll position to trigger backdrop blur effect
  const [isScrolled, setIsScrolled] = useState(false);

  // Mobile menu open/closed state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Scroll event listener
   * Adds glassmorphism effect when user scrolls past 10px
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Smooth scroll to anchor sections
   * Prevents default anchor behavior and uses smooth scrolling
   */
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Main Header - Fixed position, spans full width */}
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 border-b border-border/50 shadow-lg backdrop-blur-xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* Logo - Left side */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/rankor-logo-white-h.png"
                  width={140}
                  height={40}
                  alt="Rankor"
                  className="h-auto"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation - Center (hidden on mobile) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-muted"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons - Right side (hidden on mobile) */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/athlete/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="#early-access">
                <Button
                  size="sm"
                  className="bg-rankor hover:bg-rankor/90 text-white shadow-lg shadow-rankor/20"
                  onClick={(e) => handleSmoothScroll(e as any, '#early-access')}
                >
                  Acesso Antecipado
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button (visible only on mobile) */}
            <motion.button
              className="lg:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Slides in from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay - Click to close */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile menu panel */}
            <motion.div
              className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden lg:hidden"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 space-y-6">

                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => handleSmoothScroll(e, item.href)}
                        className="block text-foreground hover:bg-muted px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <Link href="/athlete/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>

                  <Link href="#early-access" className="block">
                    <Button
                      className="w-full bg-rankor hover:bg-rankor/90 text-white shadow-lg shadow-rankor/20"
                      onClick={(e) => {
                        handleSmoothScroll(e as any, '#early-access');
                      }}
                    >
                      Acesso Antecipado
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
