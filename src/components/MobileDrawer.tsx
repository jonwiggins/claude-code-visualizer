import { useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  title: string;
  children: React.ReactNode;
}

export function MobileDrawer({ open, onClose, side, title, children }: MobileDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} aria-hidden="true" />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-[85vw] max-w-[380px] bg-[#0d1117] border-${side === 'left' ? 'r' : 'l'} border-[#30363d] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-none h-12 border-b border-[#30363d] flex items-center justify-between px-4">
          <span className="text-sm font-semibold text-[#c9d1d9]">{title}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#30363d] rounded transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">{children}</div>
      </div>
    </>
  );
}
