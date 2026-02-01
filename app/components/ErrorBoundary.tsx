'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary details:', { error, errorInfo });
    
    // Prevent unhandled rejections from crashing the app
    if (error.message?.includes('object Object') || error.name === 'UnhandledPromiseRejectionWarning') {
      console.log('🛡️ Suppressing unhandled promise rejection');
      // Reset error state after a delay
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Minimal error UI that auto-recovers
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 1), rgba(40, 40, 50, 1))',
          color: 'white',
          fontFamily: 'system-ui',
          textAlign: 'center'
        }}>
          <div>
            <h2>🔄 Recovering...</h2>
            <p style={{ opacity: 0.7, fontSize: '14px' }}>
              Cleaning up connections...
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}