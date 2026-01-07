import { useCurrency } from '../contexts/CurrencyContext';

export function useFormatting() {
  const { currency, convert, symbol } = useCurrency();

  const formatCurrency = (value: number): string => {
    const convertedValue = convert(value);
    if (convertedValue >= 1_000_000) {
      return `${symbol}${(convertedValue / 1_000_000).toFixed(2)}M`;
    } else if (convertedValue >= 1_000) {
      return `${symbol}${(convertedValue / 1_000).toFixed(0)}K`;
    }
    return `${symbol}${convertedValue.toFixed(2)}`;
  };

  const formatCurrencyCompact = (value: number): string => {
    const convertedValue = convert(value);
    if (convertedValue >= 1_000_000) {
      return `${symbol}${(convertedValue / 1_000_000).toFixed(1)}M`;
    }
    return `${symbol}${(convertedValue / 1_000).toFixed(0)}K`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return {
    formatCurrency,
    formatCurrencyCompact,
    formatNumber,
    formatPercent,
    currency,
    symbol,
  };
}
