import { useEffect } from "react";

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-6 md:p-10 w-full max-w-xl mx-4 shadow-2xl transition-all">
        {children}
      </div>
    </div>
  );
}

export default Modal;