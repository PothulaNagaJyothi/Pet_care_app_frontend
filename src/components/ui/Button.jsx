function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95";

  const variants = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30 dark:hover:shadow-brand-500/20",
    secondary:
      "bg-slate-200 text-slate-800 border border-slate-300 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 dark:hover:shadow-rose-500/20",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;