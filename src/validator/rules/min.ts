import { RuleFunction } from "../types";

export const min: RuleFunction = (value, minValue) => {
    const min = parseFloat(minValue || '0');
    if (typeof value === 'string') return value.length >= min;

    return Number(value) >= min;
  };