import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-100 px-4 py-16 text-slate-900">
          <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
            <h1 className="text-xl font-semibold text-red-700">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-600">
              The UI hit an error while rendering. Open the browser console (F12) for the full stack trace.
            </p>
            <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-red-800">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              type="button"
              className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
