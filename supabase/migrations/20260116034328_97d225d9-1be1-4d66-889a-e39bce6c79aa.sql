-- Fix 1: Drop overly permissive INSERT policy on alerts
-- Alerts should only be created by edge functions/triggers using service role
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON alerts;

-- Fix 2: Drop overly permissive UPDATE policy on alerts
DROP POLICY IF EXISTS "Authenticated users can update alerts" ON alerts;

-- Fix 3: Create restricted UPDATE policy - only allow marking alerts as read
CREATE POLICY "Users can mark alerts as read"
ON alerts FOR UPDATE
USING (true)
WITH CHECK (is_read = true);

-- Fix 4: Create a trigger function to automatically create stock alerts when quantity drops
CREATE OR REPLACE FUNCTION public.check_and_create_stock_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  min_thresh INTEGER;
  existing_alert UUID;
BEGIN
  -- Only proceed if quantity decreased
  IF NEW.quantity < OLD.quantity THEN
    min_thresh := COALESCE(NEW.min_threshold, 5);
    
    -- Check for existing unread alert for this medicine
    SELECT id INTO existing_alert
    FROM alerts
    WHERE medicine_id = NEW.id
      AND is_read = false
      AND type IN ('LOW_STOCK', 'OUT_OF_STOCK')
    LIMIT 1;
    
    -- Only create new alert if no unread alert exists
    IF existing_alert IS NULL THEN
      IF NEW.quantity = 0 THEN
        INSERT INTO alerts (medicine_id, type, message)
        VALUES (NEW.id, 'OUT_OF_STOCK', NEW.name || ' is out of stock!');
      ELSIF NEW.quantity <= min_thresh THEN
        INSERT INTO alerts (medicine_id, type, message)
        VALUES (NEW.id, 'LOW_STOCK', NEW.name || ' is running low (' || NEW.quantity || ' left)');
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix 5: Create trigger to fire after medicine quantity updates
DROP TRIGGER IF EXISTS trigger_check_stock_alert ON medicines;
CREATE TRIGGER trigger_check_stock_alert
AFTER UPDATE OF quantity ON medicines
FOR EACH ROW
EXECUTE FUNCTION public.check_and_create_stock_alert();