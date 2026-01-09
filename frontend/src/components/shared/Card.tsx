import React from 'react';
import { Tooltip } from './Tooltip';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  tooltip?: string;
}

export function Card({ children, className = '', title, subtitle, tooltip }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-hay-brown font-display">{title}</h3>
            {tooltip && <Tooltip content={tooltip} />}
          </div>
          {subtitle && <p className="text-sm text-hay-brown-light mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
