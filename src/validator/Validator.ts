import { ErrorBag } from './ErrorBag';
import * as defaultRules from './rules';
import type { RuleFunction, LocaleMessages } from './types';
import enUS from './locales/en-US';

/**
 * Validator is a client-side validation engine.
 * It supports rule definitions, custom error messages, and localized error handling.
 */
export class Validator {
  private errorBag = new ErrorBag();
  private rules: Record<string, RuleFunction> = {};
  private fields: Map<HTMLElement, string[]> = new Map();
  private locales: Record<string, LocaleMessages> = {};
  private currentLocale: string = 'en-US';

  /**
   * Initializes the validator with default rules and messages.
   * @param locale - The default locale to use. Falls back to 'en-US' if not provided or invalid.
   */
  constructor(locale?: string) {
    this.registerDefaultRules();
    this.defineMessages('en-US', enUS);

    if (locale && this.locales[locale]) {
      this.currentLocale = locale;
    }
  }

  // =============================
  // RULE MANAGEMENT
  // =============================

  /**
   * Registers all default validation rules.
   */
  private registerDefaultRules(): void {
    Object.entries(defaultRules).forEach(([name, ruleFn]) => {
      this.defineRule(name, ruleFn as RuleFunction);
    });
  }

  /**
   * Defines a new validation rule.
   * @param name - The rule name (e.g., "required", "min").
   * @param ruleFn - The validation function.
   */
  public defineRule(name: string, ruleFn: RuleFunction): void {
    this.rules[name] = ruleFn;
  }

  // =============================
  // LOCALE & MESSAGE HANDLING
  // =============================

  /**
   * Defines localized messages for a specific locale.
   * @param locale - Locale identifier (e.g., "en-US", "pt-BR").
   * @param messages - Set of validation messages.
   */
  public defineMessages(locale: string, messages: LocaleMessages): void {
    this.locales[locale] = { ...this.locales[locale], ...messages };
  }

  /**
   * Changes the active locale. Throws an error if the locale is not registered.
   * @param locale - The locale to set.
   */
  public setLocale(locale: string): void {
    if (!this.locales[locale]) {
      throw new Error(`Locale '${locale}' is not registered. Use defineMessages() first.`);
    }
    this.currentLocale = locale;
  }

  /**
   * Resolves a localized error message for a given rule and parameter(s).
   * @param ruleName - The rule name (e.g., "min", "required").
   * @param params - Optional parameters (string or param=value).
   * @returns The localized error message.
   */
  private resolveMessage(ruleName: string, params?: string): string {
    const messages = this.locales[this.currentLocale];
    const message = messages?.[ruleName];

    if (typeof message === 'function') {
      const paramsObj = params?.includes('=')
        ? params.split(',').reduce((acc, pair) => {
            const [key, val] = pair.split('=');
            if (key && val) acc[key] = val;
            return acc;
          }, {} as Record<string, string>)
        : params;

      return message(paramsObj);
    }

    return message || `Validation failed for rule "${ruleName}".`;
  }

  public registerField(element: HTMLElement, rules: string[]) {
    this.fields.set(element, rules);
  }

  public unregisterField(element: HTMLElement) {
    this.fields.delete(element);
  }

  // =============================
  // VALIDATION CORE
  // =============================

  /**
   * Parses a rule string into its name and parameters.
   * @param rule - Rule string (e.g., "min:3", "confirmed").
   */
  private parseRule(rule: string): { name: string; params?: string } {
    const [name, params] = rule.split(':');
    return { name, params };
  }

  /**
   * Validates an input element against a set of rules.
   * @param element - The HTML element to validate.
   * @param ruleNames - List of rule names to apply.
   * @returns A promise resolving to { isValid: true } or rejecting with the error bag.
   */
  public async validate(
    element: HTMLElement,
    ruleNames: string[]
  ): Promise<{ isValid: boolean }> {
    const field = element.getAttribute('name') || '';
    const value = (element as HTMLInputElement).value;

    this.errorBag.clear(field);
    const errors: string[] = [];

    for (const rule of ruleNames) {
      const { name: ruleName, params } = this.parseRule(rule);
      const ruleFn = this.rules[ruleName];

      if (!ruleFn) {
        throw new Error(`Validation rule "${ruleName}" is not defined.`);
      }

      const isValid = await ruleFn(value, params, field);

      if (!isValid) {
        const message = this.resolveMessage(ruleName, params);
        errors.push(message);
      }
    }

    if (errors.length > 0) {
      errors.forEach(msg => this.errorBag.add(field, msg));
      return Promise.reject(this.errorBag);
    }

    return Promise.resolve({ isValid: true });
  }

  /**
   * Validate all registered fields, optionally within a DOM scope.
   * @param scope Optional HTMLElement to restrict validation to its children
   * @returns A promise with isValid and errors map
   */
  public async validateAll(scope?: HTMLElement): Promise<{ isValid: boolean; errors: Record<string, string[]> }> {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    for (const [element, rules] of this.fields.entries()) {
      // Se escopo definido e elemento NÃO está dentro do escopo, pula
      if (scope && !scope.contains(element)) continue;

      const fieldName = element.getAttribute('name') || '';
      try {
        await this.validate(element, rules);
      } catch (errorBag: any) {
        isValid = false;
        allErrors[fieldName] = errorBag.get(fieldName);
      }
    }

    return { isValid, errors: allErrors };
  }


  // =============================
  // ERROR ACCESS
  // =============================

  /**
   * Returns the internal error bag.
   */
  public get errors() {
    return this.errorBag;
  }
}
