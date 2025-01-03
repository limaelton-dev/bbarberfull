-- Política para permitir inserção de perfis
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Política para permitir leitura de perfis (opcional, dependendo do seu caso de uso)
create policy "Anyone can read profiles"
on profiles for select
using (true);

-- Política para permitir usuários atualizarem seus próprios perfis (opcional)
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id); 