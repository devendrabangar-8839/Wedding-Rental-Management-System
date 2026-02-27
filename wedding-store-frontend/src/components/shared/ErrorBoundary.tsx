'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Vows & Veils Interrupted</h1>
            <p className="text-muted-foreground max-w-md mx-auto italic">
              We encountered a slight couture malfunction. Please try refreshing the page.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="h-14 px-8 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary"
          >
            <RefreshCcw className="mr-2 h-5 w-5" /> Refresh Experience
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-muted rounded-xl text-left overflow-auto max-w-2xl w-full">
              <pre className="text-xs font-mono">{this.state.error?.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
