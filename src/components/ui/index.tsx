import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden", className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50", className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("p-4 sm:p-6", className)}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50'
  };
  
  const sizes = {
    sm: 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg'
  };
  
  return (
    <button 
      className={cn(
        "rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  warning,
  className,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs sm:text-sm font-medium text-slate-700 leading-tight">
        {label}
      </label>
    )}
    <input
      className={cn(
        "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
          : warning 
            ? "border-amber-300 focus:border-amber-500 focus:ring-amber-200"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-200",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
    {warning && !error && <p className="text-xs sm:text-sm text-amber-600">{warning}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error,
  options,
  className,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs sm:text-sm font-medium text-slate-700 leading-tight">
        {label}
      </label>
    )}
    <select
      className={cn(
        "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-200",
        "bg-white",
        className
      )}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
};

interface TabsProps {
  tabs: { id: string; label: string; icon: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center sm:flex-none",
          activeTab === tab.id
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
        )}
      >
        <span>{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);
