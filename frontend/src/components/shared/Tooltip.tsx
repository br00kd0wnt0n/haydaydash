import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = triggerRect.top - tooltipRect.height - 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

      // Keep within viewport
      if (top < 0) top = triggerRect.bottom + 8;
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      setPosition({ top, left });
    }
  }, [isVisible]);

  return (
    <span className="relative inline-flex items-center">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <Info className="w-4 h-4 text-hay-gold" />}
      </span>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm bg-hay-brown text-white rounded-lg shadow-lg max-w-xs"
          style={{ top: position.top, left: position.left }}
        >
          {content}
          <div className="absolute w-2 h-2 bg-hay-brown transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </span>
  );
}
