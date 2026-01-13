-- Enable moddatetime extension
create extension if not exists moddatetime schema extensions;

-- Create landing_pages table
create table if not exists public.landing_pages (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    name text not null,
    slug text not null,
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    content jsonb not null default '[]'::jsonb,
    is_published boolean not null default false,
    settings jsonb not null default '{}'::jsonb,
    
    constraint landing_pages_pkey primary key (id),
    constraint landing_pages_slug_key unique (slug)
);

-- Enable RLS
alter table public.landing_pages enable row level security;

-- Create policies (Mirroring projects/workspaces logic)
create policy "Users can view landing pages of their workspaces"
    on public.landing_pages for select
    using (
        workspace_id in (
            select id from public.workspaces
            where owner_id = auth.uid()
        )
    );

create policy "Users can insert landing pages into their workspaces"
    on public.landing_pages for insert
    with check (
        workspace_id in (
            select id from public.workspaces
            where owner_id = auth.uid()
        )
    );

create policy "Users can update landing pages of their workspaces"
    on public.landing_pages for update
    using (
        workspace_id in (
            select id from public.workspaces
            where owner_id = auth.uid()
        )
    );

create policy "Users can delete landing pages of their workspaces"
    on public.landing_pages for delete
    using (
        workspace_id in (
            select id from public.workspaces
            where owner_id = auth.uid()
        )
    );

-- Create updated_at trigger
create trigger handle_updated_at before update on public.landing_pages
    for each row execute procedure moddatetime (updated_at);
