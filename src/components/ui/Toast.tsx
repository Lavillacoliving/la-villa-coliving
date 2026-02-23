import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: ToastItem['type']) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const ctx: ToastContextType = {
    toast: addToast,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#15803d', icon: '\u2713' },
    error:   { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', icon: '\u2715' },
    warning: { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', icon: '\u26a0' },
    info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', icon: '\u2139' },
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type];
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
              padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)', pointerEvents: 'auto',
              animation: 'toastSlideIn 0.3s ease-out',
            }}>
              <span style={{ fontWeight: 700, color: c.text, fontSize: '16px', lineHeight: '20px' }}>{c.icon}</span>
              <span style={{ color: c.text, fontSize: '14px', flex: 1, lineHeight: '20px' }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: c.text,
                opacity: 0.5, fontSize: '16px', padding: '0 2px', lineHeight: '20px',
              }}>\u00d7</button>
            </div>
          );
        })}
      </div>
      <style>{'@keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }'}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
