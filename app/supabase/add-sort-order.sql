-- Add sort_order column to habits table
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing habits to have sequential sort_order based on created_at
WITH ordered_habits AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_order
  FROM public.habits
)
UPDATE public.habits 
SET sort_order = ordered_habits.new_order
FROM ordered_habits 
WHERE public.habits.id = ordered_habits.id;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_habits_sort_order ON public.habits(user_id, sort_order);
