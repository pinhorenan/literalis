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
    <main className="app-container py-10">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        {/* Left column: Welcome & features */}
        <section className="space-y-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Literalis</h1>
            </div>
            <h2 className="text-xl font-semibold">Sua jornada literária começa aqui</h2>
            <p className="text-muted-foreground">
              Descubra, organize e compartilhe sua paixão pelos livros com uma comunidade de
              leitores apaixonados.
            </p>
          </div>

          <div className="grid gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="hover:bg-muted/40 card-surface flex items-center gap-4 rounded-lg p-4 transition-colors"
              >
                <div className="bg-muted flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: Sign-in card */}
        <section className="flex justify-center">
          <Card className="card-surface w-full max-w-md">
            <CardHeader className="space-y-3 pb-6 text-center">
              <div className="bg-primary text-primary-foreground mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="mb-1 text-xl">Bem-vindo de volta</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Entre para continuar sua jornada literária
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={() => signIn('github')} className="h-11 w-full text-base">
                <Github className="mr-2 h-5 w-5" />
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
        </section>
      </div>
    </main>
  );
}
