// src/validation/types.ts

/**
 * Tipo para funções de validação
 * @param value Valor do campo sendo validado
 * @param params Parâmetros da regra (ex: { min: 5 } para minLength)
 * @param context Contexto adicional (formData, nome do campo, etc)
 */
export type RuleFunction = (
    value: any,
    params?: string,
    fieldName?: string
  ) => boolean | Promise<boolean>;
  
  export type LocaleMessage = 
    | string 
    | ((params?: string | Record<string, string>) => string);
  
  export type LocaleMessages = Record<string, LocaleMessage>;
  
  /**
   * Contexto disponível durante a validação
   */
  export type ValidationContext = {
    /** Nome do campo sendo validado */
    field: string;
    /** Dados completos do formulário (para validações cruzadas) */
    formData?: Record<string, any>;
    /** Elemento DOM do campo (opcional) */
    element?: HTMLElement;
  };
  
  /**
   * Configuração para uma regra de validação
   */
  export type ValidationRule = {
    name: string;
    params?: Record<string, any>;
    message?: string;
  };
  
  /**
   * Resultado de uma validação
   */
  export type ValidationResult = {
    isValid: boolean;
    errors: string[];
  };
  
  /**
   * Estrutura do ErrorBag para armazenar erros
   */
  export type ErrorBagType = {
    add: (field: string, message: string) => void;
    clear: (field?: string) => void;
    has: (field: string) => boolean;
    first: (field: string) => string | null;
    all: () => Record<string, string[]>;
  };