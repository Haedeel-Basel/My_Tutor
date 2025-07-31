-- Add missing fields to tutors table
ALTER TABLE public.tutors 
ADD COLUMN experience TEXT DEFAULT '1+ years',
ADD COLUMN education TEXT DEFAULT '',
ADD COLUMN languages TEXT[] DEFAULT ARRAY['English'],
ADD COLUMN timezone TEXT DEFAULT 'UTC',
ADD COLUMN specialties TEXT[] DEFAULT ARRAY[];