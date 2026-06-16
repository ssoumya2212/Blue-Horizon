-- ==========================================
-- BLUE HORIZON DATABASE SCHEMA MIGRATION
-- ==========================================

-- 1. Create ROUTES table if not exists
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for routes
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Routes Policies (Safely check if they exist before creating, or drop and recreate)
DROP POLICY IF EXISTS "Routes viewable by authenticated users." ON public.routes;
CREATE POLICY "Routes viewable by authenticated users." ON public.routes 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage routes." ON public.routes;
CREATE POLICY "Admins can manage routes." ON public.routes 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 2. Create PROFILES table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    student_name TEXT,
    student_roll_no TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('parent', 'driver', 'admin')),
    bus_id TEXT, -- Will link to buses(id) later
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'disabled')),
    licence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users." ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users." ON public.profiles 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles 
    FOR INSERT WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles 
    FOR UPDATE USING ( auth.uid() = id );

DROP POLICY IF EXISTS "Admins can update all profiles." ON public.profiles;
CREATE POLICY "Admins can update all profiles." ON public.profiles 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 3. Update BUSES table
-- Add columns if not already there
ALTER TABLE public.buses ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL;
ALTER TABLE public.buses ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.buses ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 40;
ALTER TABLE public.buses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Enable RLS for buses
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buses viewable by authenticated users." ON public.buses;
CREATE POLICY "Buses viewable by authenticated users." ON public.buses 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage buses." ON public.buses;
CREATE POLICY "Admins can manage buses." ON public.buses 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 4. Update STUDENTS table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_roll_no TEXT UNIQUE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL;

-- Make sure bus_id in students table references buses(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_bus_id_fkey'
    ) THEN
        ALTER TABLE public.students ADD CONSTRAINT students_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students viewable by authenticated users." ON public.students;
CREATE POLICY "Students viewable by authenticated users." ON public.students 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage students." ON public.students;
CREATE POLICY "Admins can manage students." ON public.students 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- Add bus_id FK constraint to profiles now that buses exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_bus_id_fkey'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Create DROP_LOGS table
CREATE TABLE IF NOT EXISTS public.drop_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    bus_id TEXT NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for drop_logs
ALTER TABLE public.drop_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Drop logs viewable by authenticated users." ON public.drop_logs;
CREATE POLICY "Drop logs viewable by authenticated users." ON public.drop_logs 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Drivers can insert drop logs." ON public.drop_logs;
CREATE POLICY "Drivers can insert drop logs." ON public.drop_logs 
    FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- 6. Create BUS_LOCATIONS table
CREATE TABLE IF NOT EXISTS public.bus_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id TEXT REFERENCES public.buses(id) ON DELETE CASCADE UNIQUE,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for bus_locations
ALTER TABLE public.bus_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Bus locations viewable by authenticated users." ON public.bus_locations;
CREATE POLICY "Bus locations viewable by authenticated users." ON public.bus_locations 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Drivers/Buses can upsert locations." ON public.bus_locations;
CREATE POLICY "Drivers/Buses can upsert locations." ON public.bus_locations 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 7. Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    user_role TEXT DEFAULT 'all',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications viewable by authenticated users." ON public.notifications;
CREATE POLICY "Notifications viewable by authenticated users." ON public.notifications 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can insert notifications." ON public.notifications;
CREATE POLICY "Users can insert notifications." ON public.notifications 
    FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update notifications." ON public.notifications;
CREATE POLICY "Users can update notifications." ON public.notifications 
    FOR UPDATE USING ( auth.role() = 'authenticated' );

-- 8. Create USER_SETTINGS table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings." ON public.user_settings;
CREATE POLICY "Users can view own settings." ON public.user_settings 
    FOR SELECT USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own settings." ON public.user_settings;
CREATE POLICY "Users can update own settings." ON public.user_settings 
    FOR ALL USING ( auth.uid() = user_id );

-- 9. Create APP_RELEASES table
CREATE TABLE IF NOT EXISTS public.app_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'windows')),
    file_url TEXT NOT NULL,
    file_size TEXT,
    release_notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App releases viewable by authenticated users." ON public.app_releases;
CREATE POLICY "App releases viewable by authenticated users." ON public.app_releases 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage app releases." ON public.app_releases;
CREATE POLICY "Admins can manage app releases." ON public.app_releases 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 10. Create AUDIT_LOGS table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs." ON public.audit_logs;
CREATE POLICY "Admins can view audit logs." ON public.audit_logs 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can insert audit logs." ON public.audit_logs;
CREATE POLICY "Admins can insert audit logs." ON public.audit_logs 
    FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- 11. Create DRIVERS View to satisfy COUNT(*) requirements
CREATE OR REPLACE VIEW public.drivers AS
SELECT 
    id,
    full_name AS name,
    email,
    phone,
    licence,
    bus_id,
    status,
    created_at
FROM public.profiles
WHERE role = 'driver';

-- 12. Create PARENTS View for convenience
CREATE OR REPLACE VIEW public.parents AS
SELECT 
    id,
    full_name AS name,
    email,
    phone,
    student_name,
    student_roll_no,
    created_at
FROM public.profiles
WHERE role = 'parent';

-- ==========================================
-- POPULATE SEED/DEFAULT VALUES
-- ==========================================

-- Populate routes
INSERT INTO public.routes (name, description) VALUES
    ('OMR Express', 'Anna Nagar Roundana to Blue Horizon School'),
    ('Anna Nagar Route', 'Thirumangalam Metro to Blue Horizon School'),
    ('Velachery Route', 'Phoenix Mall to Blue Horizon School'),
    ('Tambaram Route', 'Chromepet to Blue Horizon School')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Update existing buses to link to their route IDs
UPDATE public.buses SET route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE route_name = 'OMR Express';
UPDATE public.buses SET route_id = (SELECT id FROM public.routes WHERE name = 'Anna Nagar Route') WHERE route_name = 'Anna Nagar Route';
UPDATE public.buses SET route_id = (SELECT id FROM public.routes WHERE name = 'Velachery Route') WHERE route_name = 'Velachery Route';
UPDATE public.buses SET route_id = (SELECT id FROM public.routes WHERE name = 'Tambaram Route') WHERE route_name = 'Tambaram Route';

-- Update existing students to link to their roll numbers, classes, and routes
UPDATE public.students SET student_roll_no = '2026001', class = '10A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'Anna Nagar Route') WHERE name = 'Ishika S';
UPDATE public.students SET student_roll_no = '2026002', class = '10A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'Anna Nagar Route') WHERE name = 'Rohan V';
UPDATE public.students SET student_roll_no = '2026003', class = '9B', section = 'B', route_id = (SELECT id FROM public.routes WHERE name = 'Velachery Route') WHERE name = 'Meera P';
UPDATE public.students SET student_roll_no = '2026004', class = '9B', section = 'B', route_id = (SELECT id FROM public.routes WHERE name = 'Velachery Route') WHERE name = 'Kabir D';
UPDATE public.students SET student_roll_no = '2026005', class = '8C', section = 'C', route_id = (SELECT id FROM public.routes WHERE name = 'Tambaram Route') WHERE name = 'Ananya G';
UPDATE public.students SET student_roll_no = '2026015', class = '6A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE name = 'Aarav S';
UPDATE public.students SET student_roll_no = '2026012', class = '6A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE name = 'Advik N';
UPDATE public.students SET student_roll_no = '2026013', class = '6A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE name = 'Anvi K';
UPDATE public.students SET student_roll_no = '2026014', class = '6A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE name = 'Arjun M';
UPDATE public.students SET student_roll_no = '2026011', class = '6A', section = 'A', route_id = (SELECT id FROM public.routes WHERE name = 'OMR Express') WHERE name = 'Diya R';

-- ==========================================
-- EXTENDED SCHOOL BUS MANAGEMENT SCHEMA
-- ==========================================

-- 1. Update profiles for first-login onboarding check
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;

-- 2. Create parents table
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    father_name TEXT,
    mother_name TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for parents
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents are viewable by authenticated users." ON public.parents;
CREATE POLICY "Parents are viewable by authenticated users." ON public.parents 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage parents." ON public.parents;
CREATE POLICY "Admins can manage parents." ON public.parents 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 3. Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL,
    license_expiry DATE,
    experience INTEGER,
    address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Drivers are viewable by authenticated users." ON public.drivers;
CREATE POLICY "Drivers are viewable by authenticated users." ON public.drivers 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins can manage drivers." ON public.drivers;
CREATE POLICY "Admins can manage drivers." ON public.drivers 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 4. Update students table with registry information
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS register_no TEXT UNIQUE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 5. Create pickup_logs table
CREATE TABLE IF NOT EXISTS public.pickup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    bus_id TEXT REFERENCES public.buses(id) ON DELETE CASCADE,
    location_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for pickup_logs
ALTER TABLE public.pickup_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pickup logs are viewable by authenticated users." ON public.pickup_logs;
CREATE POLICY "Pickup logs are viewable by authenticated users." ON public.pickup_logs 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Drivers can insert pickup logs." ON public.pickup_logs;
CREATE POLICY "Drivers can insert pickup logs." ON public.pickup_logs 
    FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- 6. Create tracking_history table
CREATE TABLE IF NOT EXISTS public.tracking_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id TEXT REFERENCES public.buses(id) ON DELETE CASCADE,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for tracking_history
ALTER TABLE public.tracking_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tracking history viewable by authenticated users." ON public.tracking_history;
CREATE POLICY "Tracking history viewable by authenticated users." ON public.tracking_history 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Drivers can insert tracking history." ON public.tracking_history;
CREATE POLICY "Drivers can insert tracking history." ON public.tracking_history 
    FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- 7. Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id TEXT REFERENCES public.buses(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('active', 'completed')) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trips are viewable by authenticated users." ON public.trips;
CREATE POLICY "Trips are viewable by authenticated users." ON public.trips 
    FOR SELECT USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Drivers and admins can manage trips." ON public.trips;
CREATE POLICY "Drivers and admins can manage trips." ON public.trips 
    FOR ALL USING ( auth.role() = 'authenticated' );

-- 8. Enable Realtime in supabase_realtime publication
DO $$
BEGIN
  -- Add profiles table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.profiles'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;

  -- Add students table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.students'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;

  -- Add buses table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.buses'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.buses;
  END IF;

  -- Add routes table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.routes'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.routes;
  END IF;

  -- Add drop_logs table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.drop_logs'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drop_logs;
  END IF;

  -- Add bus_locations table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.bus_locations'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bus_locations;
  END IF;

  -- Add notifications table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.notifications'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;

  -- Add user_settings table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.user_settings'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;
  END IF;

  -- Add parents table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.parents'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.parents;
  END IF;

  -- Add drivers table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.drivers'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  END IF;

  -- Add pickup_logs table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.pickup_logs'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pickup_logs;
  END IF;

  -- Add tracking_history table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.tracking_history'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_history;
  END IF;

  -- Add trips table to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel 
    WHERE prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND prrelid = 'public.trips'::regclass
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  END IF;
END $$;

-- ==========================================
-- ADD SPECIFIC SCHEMAS & WORKFLOW COLUMNS
-- ==========================================

-- profiles updates
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT false;

-- parents updates
ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- students updates
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS assigned_parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS assigned_bus TEXT REFERENCES public.buses(id) ON DELETE SET NULL;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS assigned_driver TEXT;

