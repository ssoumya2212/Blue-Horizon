-- ==========================================
-- BLUE HORIZON DATABASE SCHEMA UPDATES
-- ==========================================

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    student_name TEXT,
    student_roll_no TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('parent', 'driver', 'admin')),
    bus_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id );

-- 2. Update STUDENTS table
-- Assuming the students table already exists, we just add the column
-- (Ignore if it's already there)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='students' AND column_name='student_roll_no') THEN
        ALTER TABLE public.students ADD COLUMN student_roll_no TEXT UNIQUE;
    END IF;
END $$;

-- 3. Ensure drop_logs table exists
CREATE TABLE IF NOT EXISTS public.drop_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
    bus_id TEXT NOT NULL,
    status TEXT NOT NULL,
    location_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for drop_logs
ALTER TABLE public.drop_logs ENABLE ROW LEVEL SECURITY;

-- Drop Logs Policies
CREATE POLICY "Drop logs are viewable by everyone."
    ON public.drop_logs FOR SELECT
    USING ( true );

CREATE POLICY "Drivers can insert drop logs."
    ON public.drop_logs FOR INSERT
    WITH CHECK ( true ); -- You can restrict this to auth.uid() matching a driver profile

-- 4. Create ROUTES table
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Routes viewable by everyone." ON public.routes FOR SELECT USING (true);
CREATE POLICY "Admins can insert routes." ON public.routes FOR INSERT WITH CHECK (true);

-- 5. Create BUSES table
CREATE TABLE IF NOT EXISTS public.buses (
    id TEXT PRIMARY KEY,
    route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 40,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buses viewable by everyone." ON public.buses FOR SELECT USING (true);

-- 6. Add relationships to STUDENTS table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='students' AND column_name='route_id') THEN
        ALTER TABLE public.students ADD COLUMN route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='students' AND column_name='bus_id') THEN
        ALTER TABLE public.students ADD COLUMN bus_id TEXT REFERENCES public.buses(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Enable Realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table students;
alter publication supabase_realtime add table drop_logs;
alter publication supabase_realtime add table routes;
alter publication supabase_realtime add table buses;

-- 8. Create APP_RELEASES table
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

CREATE POLICY "App releases are viewable by everyone."
    ON public.app_releases FOR SELECT
    USING ( true );

CREATE POLICY "Admins can insert app releases."
    ON public.app_releases FOR INSERT
    WITH CHECK ( true ); -- You can restrict this to role='admin' in application logic or RLS

CREATE POLICY "Admins can update app releases."
    ON public.app_releases FOR UPDATE
    USING ( true );

CREATE POLICY "Admins can delete app releases."
    ON public.app_releases FOR DELETE
    USING ( true );
