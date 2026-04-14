import React, { useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={remove} />
        </ToastContext.Provider>
    );
};

// ─── Icons & Colors ──────────────────────────────────────────────────────────
const config = {
    success: {
        icon: <CheckCircle size={20} />,
        bg: '#f0fdf4',
        border: '#86efac',
        color: '#166534',
        bar: '#22c55e',
    },
    error: {
        icon: <XCircle size={20} />,
        bg: '#fef2f2',
        border: '#fca5a5',
        color: '#991b1b',
        bar: '#ef4444',
    },
    info: {
        icon: <AlertCircle size={20} />,
        bg: '#eff6ff',
        border: '#93c5fd',
        color: '#1e40af',
        bar: '#3b82f6',
    },
};

// ─── Container ───────────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onRemove }) => (
    <div style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
    }}>
        {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
    </div>
);

// ─── Single Toast ─────────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
    const c = config[toast.type] || config.success;
    return (
        <div style={{
            pointerEvents: 'all',
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            minWidth: '300px',
            maxWidth: '420px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            animation: 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Colored left bar */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: c.bar,
                borderRadius: '12px 0 0 12px',
            }} />

            {/* Icon */}
            <span style={{ color: c.bar, flexShrink: 0 }}>{c.icon}</span>

            {/* Message */}
            <span style={{
                flex: 1,
                color: c.color,
                fontWeight: '600',
                fontSize: '0.9rem',
                lineHeight: 1.4,
            }}>
                {toast.message}
            </span>

            {/* Close button */}
            <button
                onClick={() => onRemove(toast.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.color,
                    opacity: 0.6,
                    padding: '2px',
                    display: 'flex',
                    flexShrink: 0,
                }}
            >
                <X size={16} />
            </button>

            {/* Progress bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: c.bar,
                opacity: 0.3,
                animation: 'toastProgress 3.5s linear forwards',
            }} />
        </div>
    );
};

// ─── Keyframes (injected once) ────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
@keyframes toastSlideIn {
  from { opacity: 0; transform: translateX(60px) scale(0.9); }
  to   { opacity: 1; transform: translateX(0)    scale(1);   }
}
@keyframes toastProgress {
  from { transform: scaleX(1); transform-origin: left; }
  to   { transform: scaleX(0); transform-origin: left; }
}
`;
document.head.appendChild(style);
