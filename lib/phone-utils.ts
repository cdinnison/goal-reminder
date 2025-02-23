import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export const formatPhoneNumber = (value: string, countryCode: CountryCode = 'US') => {
  try {
    const phoneNumber = parsePhoneNumber(value, countryCode);
    return phoneNumber?.format('INTERNATIONAL') || value;
  } catch {
    return value;
  }
};

export const validatePhoneNumber = (value: string, countryCode: CountryCode = 'US') => {
  try {
    return isValidPhoneNumber(value, countryCode);
  } catch {
    return false;
  }
};

export const normalizePhoneNumber = (value: string, countryCode: CountryCode = 'US') => {
  try {
    const phoneNumber = parsePhoneNumber(value, countryCode);
    return phoneNumber?.format('E.164') || value;
  } catch {
    return value;
  }
};