-- Update the trigger function to use Brazil timezone
CREATE OR REPLACE FUNCTION public.calculate_meal_derived_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Use Brazil timezone (America/Sao_Paulo) for date calculations
  NEW.week_number := EXTRACT(WEEK FROM NEW.datetime AT TIME ZONE 'America/Sao_Paulo')::INTEGER;
  NEW.month := TO_CHAR(NEW.datetime AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM');
  NEW.date_only := (NEW.datetime AT TIME ZONE 'America/Sao_Paulo')::DATE;
  RETURN NEW;
END;
$function$;

-- Fix existing data: recalculate date_only, week_number, and month with correct timezone
UPDATE public.user_meals SET
  date_only = (datetime AT TIME ZONE 'America/Sao_Paulo')::DATE,
  week_number = EXTRACT(WEEK FROM datetime AT TIME ZONE 'America/Sao_Paulo')::INTEGER,
  month = TO_CHAR(datetime AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM');