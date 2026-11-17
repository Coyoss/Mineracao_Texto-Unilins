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
- `/dashboard` — área protegida no servidor, com estudos, ranking, conquistas e perfil
- `/idealizadores` — apresentação da equipe

## Deploy na Vercel

1. Envie o repositório para GitHub.
2. Importe-o na Vercel como projeto Next.js.
3. Configure as mesmas variáveis de ambiente em **Project → Settings → Environment Variables**.
4. Atualize `NEXT_PUBLIC_SITE_URL` para `https://SEU-DOMINIO.vercel.app`.
5. Inclua `https://SEU-DOMINIO.vercel.app/auth/callback` nas Redirect URLs do Supabase.

## Ativar os estudos no Supabase

Em um projeto de teste, execute supabase/migrations/202611170001_textolab.sql pelo SQL Editor ou pelo fluxo de migrações já adotado no projeto. Depois de validar o fluxo em teste, aplique a mesma migração no banco usado pela Vercel. A migração cria o schema textolab e as funções public.textolab_* e inclui três módulos com oito aulas. Ela pressupõe que esses nomes ainda estejam livres no banco de destino. As rotas existentes de OAuth e a configuração da Vercel continuam usando as mesmas variáveis do projeto.

- O schema textolab tem RLS habilitada em todas as tabelas e não tem acesso direto concedido a anon ou authenticated. As quatro funções autorizadas para authenticated usam auth.uid(), caminho de busca fixo, e retornam somente o estado privado do próprio aluno e os campos consentidos do ranking.
- A conclusão exige acertar a questão da aula. As respostas corretas ficam no banco. O registro da atividade e as transações de XP são gravados na mesma operação. Chaves únicas e uma trava por aluno impedem duplicação por repetição ou ações simultâneas.
- A tabela textolab.rules configura XP futuro por tipo de atividade. A entrega pontua aulas e módulos. Exercícios e avaliações como atividades independentes estão previstos nas regras, sem concessão automática. Alterações de regra não recalculam o histórico. A tabela textolab.levels define os limiares.
- O ranking é opcional e usa apelido e iniciais, sem e-mail, foto do Google ou identificador interno. Empates em XP compartilham a posição. A listagem tem 12 participantes por página e é recalculada em cada consulta.
- Ajuste nome, formação, função, mini biografia, contribuição e foto em lib/idealizadores.ts. As imagens autorizadas devem ficar em public/images/idealizadores/ e usar caminhos locais. A página começa com placeholders editáveis.
- Referência de cor institucional [Mídia Kit Unilins](https://unilins.edu.br/midia-kit-unilins/). Tipografia, superfícies e componentes pertencem à identidade do projeto acadêmico.

## Arquivos da reformulação

- Modificados app/globals.css, app/page.tsx, app/dashboard/page.tsx, components/header.tsx, components/brand.tsx e este README.
- Adicionados app/dashboard/actions.ts, app/dashboard/loading.tsx, app/idealizadores/page.tsx, lib/idealizadores.ts, a pasta de fotos e a migração.
- Reutilizados os clientes Supabase, o callback OAuth, o middleware, o botão de sair, as classes de marca e os componentes de navegação. Nenhuma dependência nova.

## Validação de entrega

A revisão de código e a conferência do commit são possíveis pelo GitHub. Build, execução da migração, OAuth real e inspeção visual exigem um ambiente de execução e um Supabase configurado. Antes de publicar, execute npm run typecheck e npm run build. Depois, valide:

1. Entrar com Google, abrir /dashboard e sair. Sem sessão, confirmar o redirecionamento para /login.
2. Abrir uma aula e verificar que o progresso continua intacto. Errar a questão e confirmar que o XP não muda. Acertar e conferir +20 XP. Reenviar a resposta em duas abas e confirmar uma única concessão.
3. Completar a última aula do módulo e conferir o bônus de +100 XP, histórico e, quando aplicável, a notificação de nível ou conquista.
4. Usar duas contas. Participar do ranking com uma delas, conferir apelido, XP e progresso, e cancelar a participação. Consultas com anon devem ser recusadas e um aluno deve ver apenas o próprio histórico.
5. Conferir Home, /idealizadores e Dashboard em desktop, tablet e celular, incluindo navegação por teclado e movimento reduzido.
