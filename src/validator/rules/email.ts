import { RuleFunction } from "../types";

export const email: RuleFunction = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};  