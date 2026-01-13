-- Create storage bucket for LP images
insert into storage.buckets (id, name, public)
values ('lp-images', 'lp-images', true)
on conflict (id) do nothing;

-- Set up RLS policies for the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'lp-images' );

create policy "Authenticated Users can Upload"
  on storage.objects for insert
  with check (
    bucket_id = 'lp-images'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own images"
  on storage.objects for update
  using (
    bucket_id = 'lp-images'
    and auth.uid() = owner
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'lp-images'
    and auth.uid() = owner
  );
