declare class ErrorBag {
    private errors;
    add(field: string, message: string): void;
    clear(field?: string): void;
    has(field: string): boolean;
    first(field: string): string | null;
    all(): Record<string, string[]>;
}

export declare interface EventCallback<T = any> {
    (e: T): void;
}

export declare interface IWidget {
    option(name: string, value?: any): any;
    dispose(): void;
}

declare type LocaleMessage = string | ((params?: string | Record<string, string>) => string);

declare type LocaleMessages = Record<string, LocaleMessage>;

/**
 * Tipo para funções de validação
 * @param value Valor do campo sendo validado
 * @param params Parâmetros da regra (ex: { min: 5 } para minLength)
 * @param context Contexto adicional (formData, nome do campo, etc)
 */
declare type RuleFunction = (value: any, params?: string, fieldName?: string) => boolean | Promise<boolean>;

export declare class TextBox implements IWidget {
    private element;
    private options;
    private inputElement;
    constructor(element: HTMLElement, options?: TextBoxOptions);
    private init;
    private render;
    private bindEvents;
    option(name: string): any;
    option(name: string, value: any): void;
    dispose(): void;
}

export declare interface TextBoxOptions {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onValueChanged?: EventCallback<{
        value: string;
    }>;
}

/**
 * Validator is a client-side validation engine.
 * It supports rule definitions, custom error messages, and localized error handling.
 */
export declare class Validator {
    private errorBag;
    private rules;
    private fields;
    private locales;
    private currentLocale;
    /**
     * Initializes the validator with default rules and messages.
     * @param locale - The default locale to use. Falls back to 'en-US' if not provided or invalid.
     */
    constructor(locale?: string);
    /**
     * Registers all default validation rules.
     */
    private registerDefaultRules;
    /**
     * Defines a new validation rule.
     * @param name - The rule name (e.g., "required", "min").
     * @param ruleFn - The validation function.
     */
    defineRule(name: string, ruleFn: RuleFunction): void;
    /**
     * Defines localized messages for a specific locale.
     * @param locale - Locale identifier (e.g., "en-US", "pt-BR").
     * @param messages - Set of validation messages.
     */
    defineMessages(locale: string, messages: LocaleMessages): void;
    /**
     * Changes the active locale. Throws an error if the locale is not registered.
     * @param locale - The locale to set.
     */
    setLocale(locale: string): void;
    /**
     * Resolves a localized error message for a given rule and parameter(s).
     * @param ruleName - The rule name (e.g., "min", "required").
     * @param params - Optional parameters (string or param=value).
     * @returns The localized error message.
     */
    private resolveMessage;
    registerField(element: HTMLElement, rules: string[]): void;
    unregisterField(element: HTMLElement): void;
    /**
     * Parses a rule string into its name and parameters.
     * @param rule - Rule string (e.g., "min:3", "confirmed").
     */
    private parseRule;
    /**
     * Validates an input element against a set of rules.
     * @param element - The HTML element to validate.
     * @param ruleNames - List of rule names to apply.
     * @returns A promise resolving to { isValid: true } or rejecting with the error bag.
     */
    validate(element: HTMLElement, ruleNames: string[]): Promise<{
        isValid: boolean;
    }>;
    /**
     * Validate all registered fields, optionally within a DOM scope.
     * @param scope Optional HTMLElement to restrict validation to its children
     * @returns A promise with isValid and errors map
     */
    validateAll(scope?: HTMLElement): Promise<{
        isValid: boolean;
        errors: Record<string, string[]>;
    }>;
    /**
     * Returns the internal error bag.
     */
    get errors(): ErrorBag;
}

export { }
