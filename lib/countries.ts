import { CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  prefix: string;
  flag: string;
}

// Most common countries first, then alphabetically
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', prefix: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', prefix: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', prefix: '+44', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', prefix: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', prefix: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', prefix: '+33', flag: '🇫🇷' },
  { code: 'IN', name: 'India', prefix: '+91', flag: '🇮🇳' },
  { code: 'IT', name: 'Italy', prefix: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', prefix: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', prefix: '+82', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', prefix: '+34', flag: '🇪🇸' },
  { code: 'BR', name: 'Brazil', prefix: '+55', flag: '🇧🇷' },
];