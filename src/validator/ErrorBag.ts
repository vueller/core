export class ErrorBag {
    private errors: Record<string, string[]> = {};
  
    add(field: string, message: string): void {
      if (!this.errors[field]) this.errors[field] = [];
      this.errors[field].push(message);
    }
  
    clear(field?: string): void {
      if (field) delete this.errors[field];
      else this.errors = {};
    }
  
    has(field: string): boolean {
      return !!this.errors[field]?.length;
    }
  
    first(field: string): string | null {
      return this.errors[field]?.[0] || null;
    }
  
    all(): Record<string, string[]> {
      return this.errors;
    }
}