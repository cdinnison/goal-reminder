"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { COUNTRIES, type Country } from '@/lib/countries';
import { CountryCode } from 'libphonenumber-js';

interface CountrySelectProps {
  value: CountryCode;
  onValueChange: (value: CountryCode) => void;
}

export function CountrySelect({ value, onValueChange }: CountrySelectProps) {
  const selectedCountry = COUNTRIES.find(country => country.code === value);

  return (
    <Select value={value} onValueChange={(value) => onValueChange(value as CountryCode)}>
      <SelectTrigger className="w-[100px] h-12">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry?.flag}</span>
            <span className="text-sm">{selectedCountry?.prefix}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem 
            key={country.code} 
            value={country.code}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium">{country.name}</span>
              <span className="text-sm text-muted-foreground ml-auto">
                {country.prefix}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}