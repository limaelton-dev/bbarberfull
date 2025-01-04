import { supabase } from '@/lib/supabase/client';

export class ValidationService {
  async isEmailTaken(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_to_check: email
      });

      if (error) {
        console.error('Erro ao verificar email:', error);
        return false;
      }

      return !!data;
    } catch {
      return false;
    }
  }
} 