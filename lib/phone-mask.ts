import { CountryCode } from "libphonenumber-js";

// Define your supported countries
type SupportedCountryCode =
  | "US"
  | "CA"
  | "GB"
  | "AU"
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "JP"
  | "BR";

interface MaskConfig {
  mask: string;
  placeholder: string;
}

const MASKS: Record<SupportedCountryCode, MaskConfig> = {
  US: { mask: "(###) ###-####", placeholder: "(555) 555-1234" },
  CA: { mask: "(###) ###-####", placeholder: "(555) 555-1234" },
  GB: { mask: "#### ######", placeholder: "7911 123456" },
  AU: { mask: "#### ###-###", placeholder: "0400 123-456" },
  DE: { mask: "#### ########", placeholder: "0170 12345678" },
  FR: { mask: "## ## ## ## ##", placeholder: "06 12 34 56 78" },
  ES: { mask: "### ### ###", placeholder: "612 345 678" },
  IT: { mask: "### ### ####", placeholder: "312 345 6789" },
  JP: { mask: "##-####-####", placeholder: "90-1234-5678" },
  BR: { mask: "(##) #####-####", placeholder: "(11) 98765-4321" },
};

export const getMaskConfig = (countryCode: CountryCode): MaskConfig => {
  // Check if the country code is one we support
  if (countryCode in MASKS) {
    return MASKS[countryCode as SupportedCountryCode];
  }
  return MASKS.US;
};

export const applyPhoneMask = (
  value: string,
  countryCode: CountryCode
): string => {
  const digits = value.replace(/\D/g, "");
  const { mask } = getMaskConfig(countryCode);
  let result = "";
  let index = 0;

  for (let i = 0; i < mask.length && index < digits.length; i++) {
    if (mask[i] === "#") {
      result += digits[index];
      index++;
    } else {
      result += mask[i];
      if (index < digits.length && digits[index] === mask[i]) {
        index++;
      }
    }
  }

  return result;
};
