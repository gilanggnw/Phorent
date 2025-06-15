// Currency utilities for Indonesian Rupiah
export const CURRENCY = {
  code: 'IDR',
  symbol: 'Rp',
  name: 'Indonesian Rupiah',
  locale: 'id-ID'
} as const;

/**
 * Format price in Indonesian Rupiah
 * @param price - Price as number
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string, 
  options: {
    includeSymbol?: boolean;
    compact?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    includeSymbol = true,
    compact = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options;

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return includeSymbol ? 'Rp 0' : '0';

  const formatter = new Intl.NumberFormat(CURRENCY.locale, {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: includeSymbol ? CURRENCY.code : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: compact ? 'short' : undefined
  });

  return formatter.format(numPrice);
}

/**
 * Parse price string to number (removes formatting)
 */
export function parsePrice(priceString: string): number {
  // Remove all non-digit characters except decimal point
  const cleanPrice = priceString.replace(/[^\d.]/g, '');
  return parseFloat(cleanPrice) || 0;
}

/**
 * Calculate commission amount
 */
export function calculateCommission(price: number | string, rate: number = 0.05): number {
  const numPrice = typeof price === 'string' ? parsePrice(price) : price;
  return numPrice * rate;
}

/**
 * Calculate net amount after commission
 */
export function calculateNetAmount(price: number | string, rate: number = 0.05): number {
  const numPrice = typeof price === 'string' ? parsePrice(price) : price;
  return numPrice * (1 - rate);
}

/**
 * Pricing guidelines for Indonesian market
 */
export const PRICING_GUIDELINES = {
  digital: {
    min: 50000, // Rp 50,000
    max: 5000000, // Rp 5,000,000
    recommended: {
      beginner: [50000, 300000], // Rp 50K - 300K
      intermediate: [300000, 1500000], // Rp 300K - 1.5M
      professional: [1500000, 5000000] // Rp 1.5M - 5M
    }
  },
  physical: {
    min: 100000, // Rp 100,000
    max: 50000000, // Rp 50,000,000
    recommended: {
      small: [100000, 1000000], // Rp 100K - 1M
      medium: [1000000, 10000000], // Rp 1M - 10M
      large: [10000000, 50000000] // Rp 10M - 50M
    }
  }
};
