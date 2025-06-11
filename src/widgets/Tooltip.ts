import { IWidget } from "../types";

interface TooltipOptions {
  text: string;
  placement?: string; // 'top', 'bottom', etc.
  fixed?: boolean;
}

interface TooltipEventHandlers {
  onShow?: () => void;
  onHide?: () => void;
}

export class Tooltip implements IWidget {
  private element: HTMLElement;
  private options: TooltipOptions;
  private tooltipEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;
  private visible = false;

  constructor(element: HTMLElement, options: TooltipOptions) {
    this.element = element;
    this.options = { ...options };
    this.init();
  }

  private init() {
    this.bindEvents();
  }

  private createTooltipElement() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'tooltip';
    this.tooltipEl.textContent = this.options.text;
    this.tooltipEl.style.position = 'fixed';
    this.tooltipEl.style.zIndex = '9999';

    this.arrowEl = document.createElement('div');
    this.arrowEl.className = 'tooltip-arrow';
    this.tooltipEl.appendChild(this.arrowEl);

    document.body.appendChild(this.tooltipEl);
  }

  private bindEvents() {
    this.element.addEventListener('mouseenter', () => this.show());
    this.element.addEventListener('mouseleave', () => this.hide());
    window.addEventListener('resize', () => this.updatePosition());
    window.addEventListener('scroll', () => this.updatePosition(), true);
  }

  private show() {
    if (!this.tooltipEl) this.createTooltipElement();
    if (!this.tooltipEl) return;
    this.visible = true;
    this.tooltipEl.style.display = 'block';
    this.tooltipEl.textContent = this.options.text;
    this.tooltipEl.appendChild(this.arrowEl!);
    this.updatePosition();
  }

  private hide() {
    this.visible = false;
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  private updatePosition() {
    if (!this.tooltipEl || !this.visible) return;

    const placement = this.options.placement || 'top';
    const rect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.bottom + 8;
        left = rect.left;
        break;
    }

    // Prevent overflow
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;

    // Arrow positioning
    if (this.arrowEl) {
      const arrowSize = 8;
      this.arrowEl.style.position = 'absolute';
      if (placement === 'top' || placement === 'bottom') {
        const arrowLeft = rect.left + rect.width / 2 - left - arrowSize / 2;
        this.arrowEl.style.left = `${arrowLeft}px`;
        this.arrowEl.style.top = placement === 'top' ? '100%' : `-${arrowSize}px`;
      } else {
        const arrowTop = rect.top + rect.height / 2 - top - arrowSize / 2;
        this.arrowEl.style.top = `${arrowTop}px`;
        this.arrowEl.style.left = placement === 'left' ? '100%' : `-${arrowSize}px`;
      }
    }
  }

  public dispose() {
    this.element.removeEventListener('mouseenter', () => this.show());
    this.element.removeEventListener('mouseleave', () => this.hide());
    window.removeEventListener('resize', () => this.updatePosition());
    window.removeEventListener('scroll', () => this.updatePosition(), true);
    this.tooltipEl?.remove();
    this.tooltipEl = null;
    this.arrowEl = null;
  }

  public option<K extends keyof TooltipOptions>(name: K): TooltipOptions[K];
  public option<K extends keyof TooltipOptions>(name: K, value: TooltipOptions[K]): void;
  public option<K extends keyof TooltipOptions>(name: K, value?: TooltipOptions[K]): TooltipOptions[K] | void {
    if (value === undefined) return this.options[name];
    this.options[name] = value;
    if (name === 'text' && this.tooltipEl) this.tooltipEl.textContent = value as string;
    if (this.visible) this.updatePosition();
  }
}
