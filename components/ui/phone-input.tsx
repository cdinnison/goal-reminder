"use client";

import { useState, useEffect } from 'react';
import { Input } from './input';
import { CountrySelect } from './country-select';
import { CountryCode } from 'libphonenumber-js';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone-utils';
import { applyPhoneMask, getMaskConfig } from '@/lib/phone-mask';

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean, country: CountryCode) => void;
  className?: string;
  error?: string;
}

export function PhoneInput({ value, onChange, className, error }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('US');
  const [localValue, setLocalValue] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    try {
      const formattedValue = formatPhoneNumber(localValue, country);
      const valid = validatePhoneNumber(localValue, country);
      setIsValid(valid);
      onChange(formattedValue, valid, country);
    } catch (error) {
      console.error('Error formatting/validating phone number:', error);
      setIsValid(false);
      onChange(localValue, false, country);
    }
  }, [localValue, country, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d]/g, '');
    const maskedValue = applyPhoneMask(input, country);
    setLocalValue(maskedValue);
  };

  const { placeholder } = getMaskConfig(country);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <CountrySelect 
          value={country} 
          onValueChange={(code) => {
            setCountry(code);
            setLocalValue('');
            setShowValidation(false);
          }}
        />
        <Input
          type="tel"
          value={localValue}
          onChange={(e) => {
            handleChange(e);
            setShowValidation(false);
          }}
          onBlur={() => setShowValidation(true)}
          className={`text-base ${className}`}
          placeholder={placeholder}
          autoComplete="tel"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error && !isValid && localValue && showValidation && (
        <p className="text-sm text-muted-foreground">
          Please enter a valid phone number
        </p>
      )}
    </div>
  );
}