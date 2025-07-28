-- Create a function to set custom claims
CREATE OR REPLACE FUNCTION set_claim(
  uid uuid,
  claim text,
  value jsonb
)
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = uid
  ) THEN
    RETURN 'User not found';
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
  
  RETURN 'OK';
END;
$$;

-- Create a function to set admin role
CREATE OR REPLACE FUNCTION set_admin_role(
  uid uuid,
  is_admin boolean
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN set_claim(uid, 'role', CASE WHEN is_admin THEN '"admin"'::jsonb ELSE '"user"'::jsonb END);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION set_claim TO authenticated;
GRANT EXECUTE ON FUNCTION set_admin_role TO authenticated;
