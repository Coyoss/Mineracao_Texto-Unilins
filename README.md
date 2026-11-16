# TextoLab — Plataforma de Mineração de Texto e PLN

Aplicação educacional construída com Next.js App Router, TypeScript, Tailwind CSS e Supabase Auth (Google OAuth).

## Requisitos

- Node.js 20.9 ou superior
- npm
- Projeto Supabase
- Aplicação OAuth do Google configurada no Google Cloud

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000.

Sem as variáveis do Supabase, a Home Page funciona normalmente. O login real exige configurar as credenciais descritas abaixo; a aplicação não simula autenticação.

## Configurar Supabase e Google OAuth

1. Crie um projeto em https://supabase.com.
2. No painel Supabase, abra **Authentication → Providers → Google** e habilite Google.
3. Crie um OAuth Client ID do tipo **Web application** no Google Cloud Console.
4. Configure as origens autorizadas:
   - `http://localhost:3000`
   - URL pública da aplicação na Vercel.
5. Configure o URI de redirecionamento autorizado no Google com o callback exibido pelo Supabase em **Authentication → URL Configuration / Provider**. Normalmente é `https://<PROJECT_REF>.supabase.co/auth/v1/callback`.
6. Informe Client ID e Client Secret no provedor Google do Supabase.
7. Em **Authentication → URL Configuration**, configure:
   - Site URL: `http://localhost:3000` durante desenvolvimento (altere para o domínio de produção ao publicar).
   - Redirect URLs: `http://localhost:3000/auth/callback` e `https://SEU-DOMINIO.vercel.app/auth/callback`.
8. Copie Project URL e anon/public key de **Project Settings → API** para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

A chave pública/anon pode ser usada no cliente com RLS habilitado. **Nunca** coloque `service_role` no frontend ou neste repositório.

## Rotas

- `/` — apresentação pública
- `/login` — login Google
- `/auth/callback` — troca segura do código OAuth por sessão
- `/dashboard` — área protegida no servidor

## Deploy na Vercel

1. Envie o repositório para GitHub.
2. Importe-o na Vercel como projeto Next.js.
3. Configure as mesmas variáveis de ambiente em **Project → Settings → Environment Variables**.
4. Atualize `NEXT_PUBLIC_SITE_URL` para `https://SEU-DOMINIO.vercel.app`.
5. Inclua `https://SEU-DOMINIO.vercel.app/auth/callback` nas Redirect URLs do Supabase.
6. Faça o deploy e teste login, retorno, atualização de página e logout.

## Verificações

```bash
npm run typecheck
npm run build
```

Os comandos acima devem ser executados no ambiente com dependências instaladas. Este pacote contém o código-fonte e as configurações; a autenticação externa só pode ser validada depois de inserir as credenciais e configurar Google/Supabase.

## Segurança e escopo

- A rota `/dashboard` valida a sessão no servidor via `supabase.auth.getUser()`.
- O middleware atualiza cookies de sessão e protege a rota.
- O callback valida `next` para evitar redirecionamento externo.
- Não há banco de dados de perfil nem coleta de dados adicionais nesta primeira fase.
- Os módulos didáticos aparecem como planejados, não como conteúdo funcional.
- Antes de armazenar dados de estudantes em tabelas futuras, habilite RLS e escreva políticas por usuário.
