import { TextBoxOptions, IWidget } from '../types';

export class TextBox implements IWidget {
  private element: HTMLElement;
  private options: TextBoxOptions;
  private inputElement: HTMLInputElement | null = null;

  constructor(element: HTMLElement, options: TextBoxOptions = {}) {
    this.element = element;
    this.options = { ...options };
    this.init();
  }

  private init() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.element.innerHTML = `
      <input type="text" 
        class="dx-textbox" 
        placeholder="${this.options.placeholder || ''}"
        value="${this.options.value || ''}"
        ${this.options.disabled ? 'disabled' : ''}
        ${this.options.readOnly ? 'readonly' : ''}
      >
    `;
    this.inputElement = this.element.querySelector('input');
  }

  private bindEvents() {
    this.inputElement?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.options.value = target.value;
      this.options.onValueChanged?.({ value: target.value });
    });
  }

  option(name: string): any;
  option(name: string, value: any): void;
  option(name: string, value?: any): any {
    if (arguments.length === 1) {
      return this.options[name as keyof TextBoxOptions];
    }

    (this.options as any)[name] = value;
    
    if (!this.inputElement) return;

    switch (name) {
      case 'value':
        this.inputElement.value = value ?? '';
        break;
      case 'disabled':
        this.inputElement.disabled = value;
        break;
      case 'readOnly':
        this.inputElement.readOnly = value;
        break;
      case 'placeholder':
        this.inputElement.placeholder = value ?? '';
        break;
    }
  }

  dispose() {
    if (this.inputElement) {
      this.inputElement.removeEventListener('input', () => {});
    }
    
    this.element.innerHTML = '';
  }
}