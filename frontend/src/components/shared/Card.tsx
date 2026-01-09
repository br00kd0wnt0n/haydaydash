import React from 'react';
import { Tooltip } from './Tooltip';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  tooltip?: string;
  headerAction?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, tooltip, headerAction }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      {(title || headerAction) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {title && <h3 className="text-lg font-semibold text-hay-brown font-display">{title}</h3>}
              {tooltip && <Tooltip content={tooltip} />}
            </div>
            {subtitle && <p className="text-sm text-hay-brown-light mt-1">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
