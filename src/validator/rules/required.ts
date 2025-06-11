import { RuleFunction } from "../types";

export const required: RuleFunction = (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;

    return value !== undefined && value !== null && value !== '';
  };