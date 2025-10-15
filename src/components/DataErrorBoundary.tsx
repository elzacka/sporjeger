import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * React 19: Enhanced error boundary for data fetching errors
 * Wraps Suspense boundaries to catch async errors
 * Provides better UX with retry mechanism and error context
 */
export class DataErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Data fetch error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || '';
      const isNetworkError = errorMessage.includes('fetch') ||
                            errorMessage.includes('network') ||
                            errorMessage.includes('Failed to fetch');

      return (
        <div className="app error-state">
          <div className="error-message">
            <span
              className="material-symbols-outlined error-icon"
              aria-hidden="true"
              style={{ fontSize: '4rem', color: 'var(--matrix-green)' }}
            >
              {isNetworkError ? 'cloud_off' : 'error'}
            </span>
            <h2>
              {isNetworkError
                ? 'Ingen internettforbindelse'
                : 'Kunne ikke laste verktøy'}
            </h2>
            <p className="error-description" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {isNetworkError
                ? 'Sjekk internettforbindelsen din og prøv igjen.'
                : errorMessage || 'En ukjent feil oppstod. Prøv å laste siden på nytt.'}
            </p>
            {this.state.retryCount > 0 && (
              <p
                className="retry-count"
                role="status"
                aria-live="polite"
                style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}
              >
                Forsøk {this.state.retryCount} mislyktes
              </p>
            )}
            <div className="error-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleRetry}
                className="retry-button primary"
                aria-label="Prøv å laste dataene på nytt"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--matrix-green)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  refresh
                </span>
                Prøv igjen
              </button>
              <button
                onClick={() => window.location.reload()}
                className="retry-button secondary"
                aria-label="Last hele siden på nytt"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--matrix-green)',
                  border: '1px solid var(--matrix-green)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Last siden på nytt
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
