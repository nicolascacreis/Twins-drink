import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-[200px] p-8 text-center">
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Algo deu errado</h2>
      <p className="text-white/70">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  fallback = <LoadingFallback />,
  errorFallback = ErrorFallback
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={errorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};