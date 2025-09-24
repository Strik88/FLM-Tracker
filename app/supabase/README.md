# Supabase Schema Setup

1. Open Supabase project → SQL Editor.
2. Create new query, paste the content of `schema.sql`.
3. Run. You should see tables created and RLS policies applied.
4. Optional: insert a `profiles` row for your user id via SQL:

```sql
insert into public.profiles (user_id, display_name)
values (auth.uid(), 'Ian')
on conflict (user_id) do nothing;
```

After running, the app modules can store and read data per gebruiker dankzij RLS.
