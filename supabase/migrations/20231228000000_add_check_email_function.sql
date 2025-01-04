-- Função para verificar se um email já existe
create or replace function public.check_email_exists(email_to_check text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from auth.users 
    where email = email_to_check
  );
end;
$$;

-- Permissão para executar a função
grant execute on function public.check_email_exists(text) to anon, authenticated; 