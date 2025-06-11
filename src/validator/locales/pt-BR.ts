export default {
    // Validações básicas
    required: 'Este campo é obrigatório',
    email: 'Digite um e-mail válido',
    
    // Validações comparativas
    confirmed: (field?: string) => 
      `Deve ser igual ao ${field ? `campo ${field}` : 'campo de confirmação'}`,
    
    // Validações numéricas
    min: (value?: string) => 
      `Mínimo de ${value || 'valor'} caracteres`,
    max: (value?: string) => 
      `Máximo de ${value || 'valor'} caracteres`,
    between: (params?: string) => {
      const [min = 'mínimo', max = 'máximo'] = params?.split(',') || [];
      return `Deve estar entre ${min} e ${max}`;
    },
  
    // Validações customizadas (exemplos)
    cpf: 'CPF inválido',
    phone: (format?: string) => 
      `Use o formato ${format || '(XX) XXXX-XXXX'}`,
    password: (complexity?: string) => {
      const rules = complexity?.split(',') || [];
      let msg = 'A senha deve conter: ';
      if (rules.includes('upper')) msg += 'letra maiúscula, ';
      if (rules.includes('number')) msg += 'número, ';
      return msg.slice(0, -2);
    }
  } as const;