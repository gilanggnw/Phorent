# Currency Configuration - Indonesian Rupiah (IDR)

## Overview
The PhoRent app has been configured to use Indonesian Rupiah (IDR) as the primary currency instead of USD, making it more suitable for the Indonesian market.

## Changes Made

### 1. Currency Utility (`src/utils/currency.ts`)
- Created comprehensive currency utilities for IDR formatting
- Added Indonesian locale support (`id-ID`)
- Implemented proper number formatting with `Intl.NumberFormat`
- Added commission calculation functions
- Included pricing guidelines for Indonesian market

### 2. Updated Components

#### Sell Page (`src/app/sell/page.tsx`)
- Changed price input label from "Price (USD)" to "Price (IDR)"
- Updated currency symbol from "$" to "Rp"
- Modified commission calculation to use IDR formatting
- Updated pricing guidelines with IDR ranges:
  - Digital art: Rp 50,000 - Rp 5,000,000
  - Physical art: Rp 100,000 - Rp 50,000,000

#### Browse Page (`src/app/browse/page.tsx`)
- Updated price display to use `formatPrice()` function
- Prices now show in IDR format (e.g., "Rp 4.500.000")

#### Artwork Detail Page (`src/app/artwork/[id]/page.tsx`)
- Updated mock data to use IDR prices
- Changed price display format to IDR
- Updated related artworks pricing

### 3. Environment Variables
Added currency configuration to `.env.local`:
```
NEXT_PUBLIC_CURRENCY="IDR"
NEXT_PUBLIC_CURRENCY_SYMBOL="Rp"
NEXT_PUBLIC_CURRENCY_LOCALE="id-ID"
```

### 4. Sample Data
Updated seed data (`scripts/seed.ts`) with IDR prices:
- Modern Abstract Digital Art: Rp 4,500,000 (was $299)
- Architecture Draft: Rp 2,250,000 (was $150)
- Logo Design: Rp 1,500,000 (was $99)
- Portrait Commission: Rp 6,750,000 (was $450)

## Currency Formatting

### Usage Examples
```typescript
import { formatPrice, calculateNetAmount } from '@/utils/currency';

// Format price
formatPrice(4500000) // "Rp 4.500.000"

// Calculate net amount after 5% commission
calculateNetAmount(4500000) // 4275000

// Format with different options
formatPrice(4500000, { compact: true }) // "Rp 4,5 jt"
```

### Pricing Guidelines for Indonesian Market

**Digital Art:**
- Beginner: Rp 50,000 - Rp 300,000
- Intermediate: Rp 300,000 - Rp 1,500,000
- Professional: Rp 1,500,000 - Rp 5,000,000

**Physical Art:**
- Small: Rp 100,000 - Rp 1,000,000
- Medium: Rp 1,000,000 - Rp 10,000,000
- Large: Rp 10,000,000 - Rp 50,000,000

## Database Considerations
- The Prisma schema uses `Decimal` type for prices, which works for both currencies
- No database migration needed - existing price fields remain compatible
- All price calculations are handled in the application layer

## Testing
The currency changes are immediately visible in:
1. **Sell Page**: Price input field and commission calculation
2. **Browse Page**: Artwork price display
3. **Artwork Detail Page**: Price and related artwork pricing

## Future Enhancements
Consider adding:
- Multi-currency support
- Currency conversion rates
- Region-based currency detection
- Stripe payment integration with IDR support
