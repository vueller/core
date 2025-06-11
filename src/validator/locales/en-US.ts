export default {
  // Basic
  required: 'This field is required',
  email: 'Please enter a valid email address',

  // Confirmed (expects { target: 'fieldName' } ou string)
  confirmed: (params?: string | Record<string, string>) => {
    const target = typeof params === 'object' ? params?.target : params;
    return `Must match ${target ? `the ${target} field` : 'confirmation field'}`;
  },

  // Numeric
  min: (params?: string | Record<string, string>) => {
    const value = typeof params === 'object' ? params?.value : params;
    return `Minimum of ${value || 'value'} characters`;
  },

  max: (params?: string | Record<string, string>) => {
    const value = typeof params === 'object' ? params?.value : params;
    return `Maximum of ${value || 'value'} characters`;
  },

  between: (params?: string | Record<string, string>) => {
    let min: string | undefined, max: string | undefined;
    if (typeof params === 'string') {
      [min, max] = params.split(',');
    } else if (typeof params === 'object') {
      min = params.min;
      max = params.max;
    }
    return `Must be between ${min || 'min'} and ${max || 'max'}`;
  }
} as const;
