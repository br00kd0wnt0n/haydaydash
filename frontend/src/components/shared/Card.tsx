import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-hay-brown font-display">{title}</h3>
          {subtitle && <p className="text-sm text-hay-brown-light mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
