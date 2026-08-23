create extension if not exists pgcrypto;

create or replace function public.register_citizen(
  p_full_name text,
  p_mobile_number text,
  p_password text,
  p_state text,
  p_pincode text
)
returns table (
  id uuid,
  full_name text,
  mobile_number text,
  state text,
  pincode text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if exists (
    select 1 from public.citizen_profiles
    where mobile_number = trim(p_mobile_number)
  ) then
    raise exception 'MOBILE_ALREADY_REGISTERED';
  end if;

  return query
  insert into public.citizen_profiles (
    full_name, mobile_number, password_hash, state, pincode, is_active
  )
  values (
    trim(p_full_name),
    trim(p_mobile_number),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    trim(p_state),
    trim(p_pincode),
    true
  )
  returning citizen_profiles.id, citizen_profiles.full_name,
            citizen_profiles.mobile_number, citizen_profiles.state,
            citizen_profiles.pincode;
end;
$$;

create or replace function public.verify_citizen_login(
  p_mobile_number text,
  p_password text
)
returns table (
  id uuid,
  full_name text,
  mobile_number text,
  state text,
  pincode text
)
language sql
security definer
set search_path = public, extensions
as $$
  select cp.id, cp.full_name, cp.mobile_number, cp.state, cp.pincode
  from public.citizen_profiles cp
  where cp.is_active = true
    and cp.mobile_number = trim(p_mobile_number)
    and cp.password_hash = extensions.crypt(p_password, cp.password_hash)
  limit 1;
$$;

revoke execute on function public.register_citizen(text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.verify_citizen_login(text, text) from public, anon, authenticated;
grant execute on function public.register_citizen(text, text, text, text, text) to service_role;
grant execute on function public.verify_citizen_login(text, text) to service_role;