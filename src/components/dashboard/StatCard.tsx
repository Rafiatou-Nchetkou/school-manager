import { ReactNode } from 'react';

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel,
  color = 'primary' 
}: { 
  title: string; 
  value: string | number; 
  icon: ReactNode; 
  trend?: string; 
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning';
}) {
  const bgColors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-500',
    warning: 'bg-warning-50 text-warning-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgColors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 bg-gray-50 rounded-lg text-gray-600">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trendLabel && <p className="text-xs text-gray-400 mt-2">{trendLabel}</p>}
      </div>
    </div>
  );
}