export interface EventCallback<T = any> {
    (e: T): void;
  }
  
  export interface TextBoxOptions {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onValueChanged?: EventCallback<{ value: string }>;
  }
  
  export interface IWidget {
    option(name: string, value?: any): any;
    dispose(): void;
  }