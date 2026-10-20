import { ButtonHTMLAttributes } from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm';
  const variants = {
    primary: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}