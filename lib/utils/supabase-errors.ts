export function getSupabaseErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  // Mapeamento de mensagens de erro do Supabase
  const errorMessages: Record<string, string> = {
    'email address is already registered': 'Este email já está cadastrado',
    'email address already registered': 'Este email já está cadastrado',
    'invalid login credentials': 'Email ou senha incorretos',
    'email rate limit exceeded': 'Muitas tentativas. Tente novamente mais tarde',
    'password is too short': 'A senha deve ter pelo menos 6 caracteres',
    'invalid email': 'Email inválido',
    'email address is invalid': 'Email inválido',
    'database error saving new user': 'Erro ao salvar usuário. Tente novamente',
  };

  // Procura a mensagem no mapeamento
  for (const [key, value] of Object.entries(errorMessages)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Mensagem padrão se não encontrar correspondência
  return 'Ocorreu um erro. Tente novamente';
} 