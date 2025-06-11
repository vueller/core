import { RuleFunction } from "../types";

export const between: RuleFunction = (value, params) => {
    if (!params) return false;

    const [minStr, maxStr] = params.split(',');
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    const numValue = typeof value === 'string' ? value.length : Number(value);
    return numValue >= min && numValue <= max;
  };