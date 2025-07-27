// src/app/auth/signin/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Star, TrendingUp, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.replace('/feed');
    return null;
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Organize sua biblioteca',
      description: 'Mantenha controle de seus livros lidos, lendo e quero ler',
    },
    {
      icon: Users,
      title: 'Conecte-se com leitores',
      description: 'Siga outros usuários e descubra novas recomendações',
    },
    {
      icon: Star,
      title: 'Avalie e comente',
      description: 'Compartilhe suas opiniões sobre os livros que leu',
    },
    {
      icon: TrendingUp,
      title: 'Acompanhe seu progresso',
      description: 'Veja estatísticas da sua jornada literária',
    },
  ];

  return (
    <div className="from-primary/5 via-background to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left side - Welcome & Features */}
        <div className="animate-in slide-in-from-left space-y-8 duration-700">
          <div className="space-y-4 text-center lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <div className="from-primary to-secondary flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h1 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
                Literalis
              </h1>
            </div>
            <h2 className="text-foreground text-2xl font-semibold">
              Sua jornada literária começa aqui
            </h2>
            <p className="text-muted-foreground text-lg">
              Descubra, organize e compartilhe sua paixão pelos livros com uma comunidade de
              leitores apaixonados.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="hover:bg-muted/30 animate-in slide-in-from-left flex items-center gap-4 rounded-lg p-4 transition-colors duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sign In Card */}
        <div className="animate-in slide-in-from-right flex justify-center delay-300 duration-700">
          <Card className="border-border/50 w-full max-w-md shadow-xl">
            <CardHeader className="space-y-4 pb-6 text-center">
              <div className="from-primary to-secondary mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="mb-2 text-2xl">Bem-vindo de volta!</CardTitle>
                <p className="text-muted-foreground">Entre para continuar sua jornada literária</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={() => signIn('github')}
                className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-12 w-full bg-gradient-to-r text-lg font-semibold transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Github className="mr-3 h-5 w-5" />
                Entrar com GitHub
              </Button>

              <div className="space-y-2 text-center">
                <p className="text-muted-foreground text-sm">Primeira vez aqui?</p>
                <p className="text-muted-foreground text-xs">
                  Ao entrar, você concorda com nossos termos de uso e política de privacidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
