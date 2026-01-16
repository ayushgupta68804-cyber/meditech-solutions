-- Create a function to atomically decrement medicine quantity
-- This prevents race conditions when multiple sales happen concurrently
CREATE OR REPLACE FUNCTION public.decrement_medicine_quantity(
  _medicine_id UUID,
  _amount INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_qty INTEGER;
  med_name TEXT;
BEGIN
  -- Atomically update quantity with WHERE clause to prevent negative values
  UPDATE medicines
  SET quantity = quantity - _amount,
      updated_at = now()
  WHERE id = _medicine_id
    AND quantity >= _amount
  RETURNING quantity, name INTO new_qty, med_name;
  
  -- If no rows updated, either medicine doesn't exist or insufficient quantity
  IF NOT FOUND THEN
    -- Check if medicine exists
    SELECT name INTO med_name FROM medicines WHERE id = _medicine_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Medicine not found';
    ELSE
      RAISE EXCEPTION 'Insufficient quantity for %', med_name;
    END IF;
  END IF;
  
  RETURN new_qty;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.decrement_medicine_quantity(UUID, INTEGER) TO authenticated;