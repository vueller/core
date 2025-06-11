import { RuleFunction } from "../types";

export const max: RuleFunction = (value, maxValue) => {
    const max = parseFloat(maxValue || '0');
    if (typeof value === 'string') return value.length <= max;
    return Number(value) <= max;
};