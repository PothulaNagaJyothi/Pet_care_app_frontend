function Input({ className = "", ...props }) {
  return (
    <input
      className={`p-3 bg-slate-50 border border-slate-300 text-slate-900 
      dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100
      rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all ${className}`}
      {...props}
    />
  );
}

export default Input;