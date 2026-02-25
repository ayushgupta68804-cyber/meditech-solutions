
CREATE OR REPLACE FUNCTION public.get_email_by_mobile(_mobile text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE mobile = _mobile LIMIT 1
$$;
