function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white border border-slate-200 shadow-sm dark:bg-slate-800/80 dark:border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-1" : ""
        } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;