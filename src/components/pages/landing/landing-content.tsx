// src/components/pages/landing/landing-content.tsx
'use client';

import { Sparkles, UserPlus as UserRoundPlusIcon } from 'lucide-react';
import { CircleVector, Logo } from '@/components/pages/landing/landing-decorations';
import { ModeToggle } from '@/src/components/layout/buttons/ModeToggle';
import { Button } from '@/src/components/ui/button';
import { useSession } from 'next-auth/react';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';

function LandingHero() {
  const { data: session } = useSession();

  return (
    <div className="relative z-10 max-w-xl space-y-6 pb-2 text-left">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <Logo className="w-15 h-15" />
        <h1 className="text-foreground text-2xl font-bold">Literalis</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-card text-foreground mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      >
        <Sparkles size={16} />
        Nova rede social literária
      </motion.div>

      <motion.h1
        className="text-foreground text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div>Conecte leitores.</div>
        <div>Descubra livros.</div>
        <div className="relative inline-block">
          <motion.span
            initial={{ backgroundSize: '0% 100%' }}
            animate={{ backgroundSize: '100% 100%' }}
            transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
            className="relative -left-2 z-10 bg-[linear-gradient(120deg,var(--theme-color-surface-alt)_0%,var(--theme-color-surface-alt)_100%)] bg-[length:0%_0.25rem] bg-left-bottom bg-no-repeat px-2"
          >
            Compartilhe histórias.
          </motion.span>
        </div>
      </motion.h1>

      <motion.p
        className="text-muted max-w-prose text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Na Literalis, você acompanha leituras de amigos, mantém sua estante virtual e descobre obras
        incríveis.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Link href={session ? `/feed` : `/auth/signin`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" size="lg">
            {session ? null : <UserRoundPlusIcon className="h-5 w-5" />}
            {session ? 'Feed' : 'Faça parte da comunidade'}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function LandingContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-w-screen from-surface to-surface-alt lg:px-24' relative isolate flex min-h-screen flex-col-reverse items-center justify-evenly gap-12 overflow-hidden bg-gradient-to-b px-6 py-16 lg:flex-row"
    >
      {/* Toggle de tema */}
      <div className="absolute right-6 top-6 z-20">
        <ModeToggle />
      </div>

      {/* Background texture */}
      <Image
        src="/images/paper-texture.png"
        alt=""
        fill
        className="pointer-events-none absolute inset-0 z-0 object-cover opacity-40"
      />

      {/* Círculos decorativos */}
      <CircleVector className="absolute -bottom-32 -left-32 z-10 h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]" />
      <CircleVector className="absolute -top-32 right-0 z-10 h-[240px] w-[240px] md:h-[320px] md:w-[320px] lg:h-[480px] lg:w-[480px]" />

      <LandingHero />

      <motion.div
        className="border-border z-10 hidden aspect-square w-full max-w-sm overflow-hidden rounded-full border shadow-md lg:block"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Image
          src="/images/reading_circle.png"
          alt="Ilustração de boas-vindas"
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.section>
  );
}
