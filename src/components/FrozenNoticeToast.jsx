"use client";

import { useState, useEffect } from "react";

function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function useFrozenNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  return { notice, showNotice: setNotice, dismiss: () => setNotice(null) };
}

export default function FrozenNoticeToast({ notice, onDismiss }) {
  if (!notice) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md bg-surface border border-danger/30 rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertIcon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm text-text flex-1">{notice}</p>
        <button
          onClick={onDismiss}
          className="text-text-secondary hover:text-text shrink-0"
          aria-label="Dismiss"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}