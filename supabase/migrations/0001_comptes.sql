-- Jade : comptes en ligne partagés par le site et l'application.
-- Sécurité par RLS : chaque joueur ne lit/écrit que ses propres lignes ; l'abonnement et les achats
-- ne sont écrits que par le serveur (webhook Stripe, clé service_role).

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  pseudo text not null unique check (pseudo ~ '^[A-Za-z0-9_.-]{3,24}$'),
  created_at timestamptz not null default now()
);
create table if not exists public.user_state (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  offer text not null check (offer in ('plus_m', 'plus_y', 'founder')),
  until timestamptz not null,
  renew boolean not null default false,
  source text not null default 'stripe',
  stripe_customer text, stripe_subscription text,
  updated_at timestamptz not null default now()
);
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  offer text not null, price numeric(8, 2) not null,
  stripe_session text unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_state enable row level security;
alter table public.subscriptions enable row level security;
alter table public.purchases enable row level security;

-- Pseudos visibles par tous (vitrines publiques), modifiables par leur propriétaire.
create policy "profils lisibles" on public.profiles for select using (true);
create policy "profil créé par soi" on public.profiles for insert with check (auth.uid() = id);
create policy "profil modifié par soi" on public.profiles for update using (auth.uid() = id);
-- Données de jeu : uniquement les siennes.
create policy "état lu par soi" on public.user_state for select using (auth.uid() = user_id);
create policy "état créé par soi" on public.user_state for insert with check (auth.uid() = user_id);
create policy "état modifié par soi" on public.user_state for update using (auth.uid() = user_id);
-- Abonnement et achats : lecture seule pour le joueur.
create policy "abonnement lu par soi" on public.subscriptions for select using (auth.uid() = user_id);
create policy "achats lus par soi" on public.purchases for select using (auth.uid() = user_id);
