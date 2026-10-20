import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white p-6 rounded-2xl shadow-sm border border-gray-100', className)}>
      {children}
    </div>
  );
}