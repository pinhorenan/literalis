// src/app/auth/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { completeOnboarding } from './actions';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, BookOpen, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PopularBooks } from '@/components/onboarding/PopularBooks';
import { SuggestedUsers } from '@/components/onboarding/SuggestedUsers';

const initialState = { success: false, error: undefined as string | undefined };

export default function OnboardingPage() {
  const [state, formAction] = useActionState(completeOnboarding, initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (state.success) redirect('/feed');

  const steps = [
    {
      number: 1,
      title: 'Crie seu perfil',
      description: 'Escolha seu nome de usuário e nome de exibição',
      icon: User,
    },
    {
      number: 2,
      title: 'Adicione livros',
      description: 'Selecione alguns livros para começar sua estante',
      icon: BookOpen,
    },
    {
      number: 3,
      title: 'Conecte-se',
      description: 'Siga outros leitores para descobrir novos conteúdos',
      icon: Users,
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('selectedBooks', JSON.stringify(selectedBooks));
    formData.append('selectedUsers', JSON.stringify(selectedUsers));
    formAction(formData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return username.length >= 3 && /^[a-z0-9_]+$/i.test(username);
      case 2:
        return true; // Livros são opcionais
      case 3:
        return true; // Usuários são opcionais
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${currentStep >= step.number 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4 transition-colors duration-300
                    ${currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Profile */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="space-y-4 max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome de usuário *
                      </label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: fiodor_dostoievski"
                        className="text-center"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Use apenas letras, números e "_". Mínimo 3 caracteres.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome de exibição (opcional)
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ex: Fiódor Dostoiévski"
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Como você gostaria de aparecer para outros usuários.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Books */}
              {currentStep === 2 && (
                <div className="animate-in slide-in-from-right duration-500">
                  <PopularBooks
                    selectedBooks={selectedBooks}
                    onBooksSelected={setSelectedBooks}
                  />
                </div>
              )}

              {/* Step 3: Users */}
              {currentStep === 3 && (
                <div className="animate-in slide-in-from-right duration-500">
                  <SuggestedUsers
                    selectedUsers={selectedUsers}
                    onUsersSelected={setSelectedUsers}
                  />
                </div>
              )}

              {/* Error Message */}
              {state.error && (
                <div className="text-center">
                  <p className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg">
                    {state.error}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {currentStep} de {steps.length}
                  </p>
                </div>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Check className="w-4 h-4" />
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Skip Option */}
        {currentStep > 1 && (
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === 2) {
                  setSelectedBooks([]);
                  setCurrentStep(3);
                } else if (currentStep === 3) {
                  handleSubmit({ preventDefault: () => {} } as any);
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Pular esta etapa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
