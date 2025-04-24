'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="w-[582px] h-[582px] bg-[#ffffff] p-[30px] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
          <div className="h-full flex items-center justify-center">
            <p className="text-[14px] font-[700] tracking-normal leading-normal text-red-500">
              Something went wrong. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 