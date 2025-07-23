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
      description: 'Mantenha controle de seus livros lidos, lendo e quero ler'
    },
    {
      icon: Users,
      title: 'Conecte-se com leitores',
      description: 'Siga outros usuários e descubra novas recomendações'
    },
    {
      icon: Star,
      title: 'Avalie e comente',
      description: 'Compartilhe suas opiniões sobre os livros que leu'
    },
    {
      icon: TrendingUp,
      title: 'Acompanhe seu progresso',
      description: 'Veja estatísticas da sua jornada literária'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome & Features */}
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Literalis
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Sua jornada literária começa aqui
            </h2>
            <p className="text-muted-foreground text-lg">
              Descubra, organize e compartilhe sua paixão pelos livros com uma comunidade de leitores apaixonados.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sign In Card */}
        <div className="flex justify-center animate-in slide-in-from-right duration-700 delay-300">
          <Card className="w-full max-w-md shadow-xl border-border/50">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Bem-vindo de volta!</CardTitle>
                <p className="text-muted-foreground">
                  Entre para continuar sua jornada literária
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={() => signIn('github')}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Github className="w-5 h-5 mr-3" />
                Entrar com GitHub
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Primeira vez aqui?
                </p>
                <p className="text-xs text-muted-foreground">
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
