// src/components/core/ErrorState.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorState({
  message = 'Ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.',
  onRetry,
  showRetry = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Algo deu errado</h3>
        <p className="text-destructive/80 max-w-md">{message}</p>
      </div>
      {showRetry && onRetry && (
        <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
