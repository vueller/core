import { RuleFunction } from "../types";

export const confirmed: RuleFunction = (value, fieldName) => {
    if (!fieldName) return false;
    
    const target = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
    return value === target?.value;
  };