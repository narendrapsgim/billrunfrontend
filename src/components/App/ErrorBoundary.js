import React, { Component } from 'react';
import { showDanger } from '@/actions/alertsActions';
import { ErrorInternal500 } from '../StaticPages';

class ErrorBoundary extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    if (process.env.NODE_ENV === "development") {
      console.log("App Error: ", error);
      console.log("App Info: ", info);
    }
  }

  render() {
    if (this.state.hasError && process.env.NODE_ENV === "development") {
      return <ErrorInternal500 />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
