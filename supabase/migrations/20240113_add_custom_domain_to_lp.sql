-- Add custom_domain column to landing_pages
alter table public.landing_pages
add column if not exists custom_domain text unique;

-- Create index for faster lookups since middleware will query this often
create index if not exists landing_pages_custom_domain_idx on public.landing_pages(custom_domain);
