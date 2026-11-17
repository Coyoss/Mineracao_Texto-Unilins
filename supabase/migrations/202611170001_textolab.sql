begin;
create schema textolab;
revoke all on schema textolab from public, anon, authenticated;
create table textolab.modules(id text primary key,title text not null, ordering int unique,published boolean default true not null);
create table textolab.lessons(id text primary key,module_id text not null references textolab.modules,
 ordering int unique,title text not null,body text not null,question text not null,options text[] not null,
 answer int not null check(answer between 1 and cardinality(options)),published boolean default true not null);
create table textolab.profiles(student uuid primary key references auth.users on delete cascade,
 nickname text not null check(char_length(nickname) between 2 and 24),listed boolean not null default false);
create table textolab.progress(student uuid references auth.users on delete cascade,lesson text references textolab.lessons,
 accessed_at timestamptz not null default now(),completed_at timestamptz,primary key(student,lesson));
create table textolab.rules(source text primary key,points int not null check(points>=0));
create table textolab.xp(student uuid references auth.users on delete cascade,source text references textolab.rules,
 reference text,points int not null check(points>=0),awarded_at timestamptz not null default now(),primary key(student,source,reference));
create table textolab.achievements(id text primary key, title text not null, criterion text not null);
create table textolab.student_achievements (
 student uuid references auth.users on delete cascade, achievement text references textolab.achievements,
 unlocked_at timestamptz not null default now(), primary key(student,achievement)
);
alter table textolab.achievements enable row level security;
alter table textolab.student_achievements enable row level security;
insert into textolab.achievements values
 ('first','Primeiros passos','Conclua a primeira aula.'),
 ('explorer','Explorador','Conclua três módulos.'),
 ('analyst','Analista de textos','Conclua o módulo de Mineração de texto e PLN.'),
 ('words','Mestre das palavras','Conclua o módulo de Pré-processamento.'),
 ('streak','Persistência','Conclua aulas em três dias consecutivos.'),
 ('expert','Especialista','Alcance o nível 5.');
create table textolab.levels(number int primary key,title text not null,threshold int not null unique);
alter table textolab.modules enable row level security;
alter table textolab.lessons enable row level security;
alter table textolab.profiles enable row level security;
alter table textolab.progress enable row level security;
alter table textolab.rules enable row level security;
alter table textolab.xp enable row level security;
alter table textolab.levels enable row level security;
insert into textolab.modules(id,title,ordering) values
('fundamentos','Mineração de texto e PLN',1),
('preprocessamento','Pré-processamento',2),
('analise','Análise e representação',3);
insert into textolab.lessons(id,module_id,ordering,title,body,question,options,answer) values
('mineracao','fundamentos',1,'O que é mineração de texto?','Mineração de texto extrai padrões de documentos. Uma análise de avaliações pode contar termos e agrupar comentários para identificar problemas recorrentes. O contexto importa. Uma frequência elevada indica recorrência e precisa ser interpretada junto às frases originais.','Qual tarefa exemplifica mineração de texto?',array['Separar documentos por tamanho em bytes','Encontrar temas recorrentes em avaliações','Compactar documentos para armazenamento'],2),
('pln','fundamentos',2,'Tarefas de PLN','O processamento de linguagem natural transforma texto em estruturas que programas conseguem analisar. Reconhecer entidades, classificar documentos e resumir conteúdo são tarefas diferentes. Em “Ana mora em Lins”, Ana é uma pessoa e Lins é um lugar.','Qual tarefa identifica Ana como pessoa?',array['Compactação','Ordenação alfabética','Reconhecimento de entidades'],3),
('tokenizacao','preprocessamento',3,'Tokenização e normalização','A tokenização divide o texto em unidades, como palavras ou partes de palavras. A normalização pode padronizar maiúsculas e minúsculas. Ao normalizar e separar “Dados revelam Dados”, obtemos três tokens, dois deles iguais a dados.','Quantas ocorrências de dados aparecem no exemplo normalizado?',array['Duas','Uma','Três'],1),
('stopwords','preprocessamento',4,'Stopwords','Palavras muito frequentes às vezes são removidas para reduzir ruído. A escolha depende da tarefa. Em análise de sentimentos, remover “não” de “não gostei” pode inverter a interpretação.','Qual palavra merece ser preservada em “não gostei”?',array['Todas devem ser apagadas','A negação não','Somente a palavra anterior à frase'],2),
('raizes','preprocessamento',5,'Stemming e lematização','Stemming usa regras de corte para agrupar formas relacionadas. A raiz produzida pode ficar fora do dicionário. A lematização busca a forma canônica da palavra, como ir para fomos, considerando informações linguísticas.','Qual técnica busca uma forma canônica de dicionário?',array['Stemming','Tokenização','Lematização'],3),
('frequencia','analise',6,'Frequência de palavras','Uma contagem de frequência registra quantas vezes cada termo ocorre. A frequência relativa divide a contagem pelo total de tokens, o que ajuda a comparar documentos de tamanhos diferentes.','Qual a frequência relativa de um termo com 5 ocorrências em 20 tokens?',array['25%','5%','20%'],1),
('sentimento','analise',7,'Análise de sentimentos','Análise de sentimentos identifica polaridade em textos. Uma avaliação pode expressar opiniões opostas sobre aspectos diferentes. Em “o produto é ótimo, mas a entrega atrasou”, produto e entrega recebem sinais distintos.','Qual leitura preserva a opinião sobre cada aspecto?',array['Tudo é positivo','Produto positivo e entrega negativa','Tudo é negativo'],2),
('vetores','analise',8,'Representação vetorial e classificação','Bag of words mapeia textos para vetores de contagem de um vocabulário. Com vocabulário [dados, texto], o documento “dados dados texto” vira [2, 1]. Um classificador pode usar esses vetores como entrada para prever categorias.','Qual o vetor de “texto texto dados” nesse vocabulário?',array['[2, 1]','[2, 2]','[1, 2]'],3);
insert into textolab.rules values ('lesson',20),('module',100),('exercise',30),('assessment',50);
insert into textolab.levels values (1,'Iniciante',0),(2,'Explorador',40),(3,'Analista',120),(4,'Pesquisador',200),(5,'Especialista',320),(6,'Mestre em Linguagem',460);

create view textolab.catalog as select l.* from textolab.lessons l join textolab.modules m on m.id=l.module_id where l.published and m.published;
create view textolab.ranking as
 with totals as (
 select p.student,p.nickname,
 coalesce((select sum(x.points) from textolab.xp x where x.student=p.student),0) as xp,
 (select count(*) from textolab.progress s join textolab.catalog c on c.id=s.lesson
  where s.student=p.student and s.completed_at is not null) as completed
 from textolab.profiles p where p.listed)
 select *,rank() over(order by xp desc) as position from totals;

create function public.textolab_state(p_offset int default 0)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare uid uuid := auth.uid(); total_xp bigint;
begin
 if uid is null then raise exception 'Sessão obrigatória'; end if;
 select coalesce(sum(points),0) into total_xp from textolab.xp where student=uid;
 return jsonb_build_object(
 'xp',total_xp,
 'level',(select to_jsonb(t) from textolab.levels t where threshold<=total_xp order by threshold desc limit 1),
 'next',(select to_jsonb(t) from textolab.levels t where threshold>total_xp order by threshold limit 1),
 'profile',(select jsonb_build_object('nickname',nickname,'listed',listed) from textolab.profiles where student=uid),
 'badges',(select jsonb_agg(jsonb_build_object('id',a.id,'title',a.title,'criterion',a.criterion,
 'earned',s.unlocked_at is not null) order by a.id) from textolab.achievements a
 left join textolab.student_achievements s on s.achievement=a.id and s.student=uid),
 'position',(select position from textolab.ranking where student=uid),
 'ownRank',(select to_jsonb(r)-'student' from textolab.ranking r where student=uid),
 'rankingCount',(select count(*) from textolab.ranking),
 'ranking',coalesce((select jsonb_agg((to_jsonb(r)-'student')||jsonb_build_object('mine',r.student=uid,'level',
 (select title from textolab.levels where threshold<=r.xp order by threshold desc limit 1)) order by r.position,r.student)
 from (select * from textolab.ranking order by position,student limit 12 offset greatest(p_offset,0)) r),'[]'::jsonb),
 'modules',(select coalesce(jsonb_agg(to_jsonb(m) order by ordering),'[]'::jsonb) from textolab.modules m where published),
 'lessons',(select coalesce(jsonb_agg(to_jsonb(c)-'answer' order by ordering),'[]'::jsonb) from textolab.catalog c),
 'progress',(select coalesce(jsonb_agg(to_jsonb(s)-'student' order by s.accessed_at desc),'[]'::jsonb)
 from textolab.progress s join textolab.catalog c on c.id=s.lesson where s.student=uid));
end $$;

create function public.textolab_access(p_lesson text)
returns void language plpgsql security definer set search_path='' as $$
declare uid uuid := auth.uid();
begin
 if uid is null then raise exception 'Sessão obrigatória'; end if;
 insert into textolab.progress(student,lesson) select uid,id from textolab.catalog where id=p_lesson
 on conflict(student,lesson) do update set accessed_at=now();
end $$;

create function public.textolab_complete(p_lesson text,p_answer int)
returns text language plpgsql security definer set search_path='' as $
declare
 uid uuid := auth.uid();
 item textolab.lessons%rowtype;
 previous_level int;
 current_level int;
 earned int;
begin
 if uid is null then raise exception 'Sessão obrigatória'; end if;
 select * into item from textolab.catalog where id=p_lesson;
 if not found then return 'missing'; end if;
 if p_answer is distinct from item.answer then return 'retry'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text,0));
 select max(number) into previous_level from textolab.levels
 where threshold<=(select coalesce(sum(points),0) from textolab.xp where student=uid);
 insert into textolab.progress as s(student,lesson,accessed_at,completed_at) values(uid,item.id,now(),now())
 on conflict(student,lesson) do update set accessed_at=now(),completed_at=now() where s.completed_at is null;
 if not found then return 'already'; end if;
 insert into textolab.xp(student,source,reference,points)
 select uid,source,item.id,points from textolab.rules where source='lesson' on conflict do nothing;
 if not exists(select 1 from textolab.catalog c where c.module_id=item.module_id and not exists(
 select 1 from textolab.progress s where s.student=uid and s.lesson=c.id and s.completed_at is not null)) then
 insert into textolab.xp(student,source,reference,points)
 select uid,source,item.module_id,points from textolab.rules where source='module' on conflict do nothing;
 end if;
 select max(number) into current_level from textolab.levels
 where threshold<=(select coalesce(sum(points),0) from textolab.xp where student=uid);
 with studied_days as (
   select distinct (completed_at at time zone 'America/Sao_Paulo')::date as day
   from textolab.progress where student=uid and completed_at is not null
 ), earned_modules as (
   select reference from textolab.xp where student=uid and source='module'
 )
 insert into textolab.student_achievements (student,achievement)
 select uid,a.id from textolab.achievements a
 where case a.id
   when 'first' then true
   when 'explorer' then (select count(*) from earned_modules)>=3
   when 'analyst' then exists(select 1 from earned_modules where reference='fundamentos')
   when 'words' then exists(select 1 from earned_modules where reference='preprocessamento')
   when 'expert' then current_level>=5
   when 'streak' then exists(
     select 1 from studied_days d join studied_days e on e.day=d.day+1
     join studied_days f on f.day=d.day+2)
   else false end
 on conflict do nothing;
 get diagnostics earned = row_count;
 if current_level>previous_level and earned>0 then return 'level_badge'; end if;
 if current_level>previous_level then return 'level'; end if;
 if earned>0 then return 'badge'; end if;
 return 'completed';
end $$;

create function public.textolab_profile(p_nickname text,p_listed boolean)
returns void language plpgsql security definer set search_path='' as $$
declare uid uuid := auth.uid(); clean text := btrim(p_nickname);
begin
 if uid is null then raise exception 'Sessão obrigatória'; end if;
 if clean is null or char_length(clean) not between 2 and 24 or clean ~ '[[:cntrl:]@]' then
 raise exception 'Apelido inválido'; end if;
 insert into textolab.profiles values(uid,clean,coalesce(p_listed,false))
 on conflict(student) do update set nickname=excluded.nickname,listed=excluded.listed;
end $$;

revoke all on function public.textolab_state(int),public.textolab_access(text),public.textolab_complete(text,int),
 public.textolab_profile(text,boolean) from public,anon,authenticated;
grant execute on function public.textolab_state(int),public.textolab_access(text),public.textolab_complete(text,int),
 public.textolab_profile(text,boolean) to authenticated;
commit;
