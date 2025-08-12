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
    <main className="app-container py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    } `}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-muted-foreground hidden text-xs sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-16 ${currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'} `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit}>
          <Card className="card-surface">
            <CardHeader className="pb-6 text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
              <p className="text-muted-foreground text-sm">{steps[currentStep - 1].description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mx-auto max-w-md space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nome de usuário *</label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: fiodor_dostoievski"
                        className="text-center"
                        required
                      />
                      <p className="text-muted-foreground mt-1 text-center text-xs">
                        Use apenas letras, números e &quot;_&quot;. Mínimo 3 caracteres.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Nome de exibição (opcional)
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ex: Fiódor Dostoiévski"
                        className="text-center"
                      />
                      <p className="text-muted-foreground mt-1 text-center text-xs">
                        Como você gostaria de aparecer para outros usuários.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Books */}
              {currentStep === 2 && (
                <div>
                  <PopularBooks selectedBooks={selectedBooks} onBooksSelected={setSelectedBooks} />
                </div>
              )}

              {/* Step 3: Users */}
              {currentStep === 3 && (
                <div>
                  <SuggestedUsers
                    selectedUsers={selectedUsers}
                    onUsersSelected={setSelectedUsers}
                  />
                </div>
              )}

              {/* Error Message */}
              {state.error && (
                <div className="text-center">
                  <p className="text-destructive bg-destructive/10 rounded-lg px-4 py-2 text-sm">
                    {state.error}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
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
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Skip Option */}
        {currentStep > 1 && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === 2) {
                  setSelectedBooks([]);
                  setCurrentStep(3);
                } else if (currentStep === 3) {
                  // Submit without synthetic event
                  const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleSubmit(fakeEvent);
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Pular esta etapa
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
