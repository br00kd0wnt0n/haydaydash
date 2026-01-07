import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (euroAmount: number) => number;
  symbol: string;
}

const EUR_TO_USD_RATE = 1.08; // Approximate conversion rate

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const convert = (euroAmount: number): number => {
    if (currency === 'USD') {
      return euroAmount * EUR_TO_USD_RATE;
    }
    return euroAmount;
  };

  const symbol = currency === 'EUR' ? '€' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
