
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP POLICY "Anyone can create booking" ON public.bookings;
CREATE POLICY "Anyone can create booking" ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (
  length(customer_name) BETWEEN 1 AND 120
  AND length(phone) BETWEEN 5 AND 30
  AND length(email) BETWEEN 5 AND 200 AND email LIKE '%_@_%.__%'
  AND length(package_id) BETWEEN 1 AND 60
  AND total_price >= 0
  AND status = 'pending'
);
