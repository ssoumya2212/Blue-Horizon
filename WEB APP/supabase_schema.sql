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
CREATE POLICY "Profiles are viewable by authenticated users."
    ON public.profiles FOR SELECT
    USING ( auth.role() = 'authenticated' );

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

-- Enable RLS for students if not already enabled
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students viewable by authenticated users." ON public.students FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins can manage students." ON public.students FOR ALL USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

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
CREATE POLICY "Drop logs viewable by authenticated users."
    ON public.drop_logs FOR SELECT
    USING ( auth.role() = 'authenticated' );

CREATE POLICY "Drivers can insert drop logs."
    ON public.drop_logs FOR INSERT
    WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'driver') );

-- 4. Create ROUTES table
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Routes viewable by authenticated users." ON public.routes FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins can insert routes." ON public.routes FOR INSERT WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

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
CREATE POLICY "Buses viewable by authenticated users." ON public.buses FOR SELECT USING ( auth.role() = 'authenticated' );

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

CREATE POLICY "App releases viewable by authenticated users."
    ON public.app_releases FOR SELECT
    USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can insert app releases."
    ON public.app_releases FOR INSERT
    WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

CREATE POLICY "Admins can update app releases."
    ON public.app_releases FOR UPDATE
    USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

CREATE POLICY "Admins can delete app releases."
    ON public.app_releases FOR DELETE
    USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

-- 9. Create AUDIT_LOGS table
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
CREATE POLICY "Admins can view audit logs." ON public.audit_logs FOR SELECT USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );
CREATE POLICY "Admins can insert audit logs." ON public.audit_logs FOR INSERT WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

-- 10. Create BUS_LOCATIONS table
CREATE TABLE IF NOT EXISTS public.bus_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id TEXT REFERENCES public.buses(id) ON DELETE CASCADE,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bus_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bus locations viewable by authenticated users." ON public.bus_locations FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Drivers can update bus locations." ON public.bus_locations FOR ALL USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'driver') );

-- 11. Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    user_role TEXT DEFAULT 'all',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications viewable by authenticated users." ON public.notifications FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins can insert notifications." ON public.notifications FOR INSERT WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );
CREATE POLICY "Parents can insert messages to drivers." ON public.notifications FOR INSERT WITH CHECK ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'parent') );
CREATE POLICY "Admins can update notifications." ON public.notifications FOR UPDATE USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

-- 12. Create USER_SETTINGS table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings." ON public.user_settings FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY "Users can update own settings." ON public.user_settings FOR ALL USING ( auth.uid() = user_id );

-- 13. Create PASSENGERS table (Aligns with src/services/passengers.ts)
CREATE TABLE IF NOT EXISTS public.passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Passengers viewable by authenticated users." ON public.passengers FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins can manage passengers." ON public.passengers FOR ALL USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

-- 14. Enable Realtime for new tables
alter publication supabase_realtime add table bus_locations;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table user_settings;
alter publication supabase_realtime add table passengers;

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

-- ==========================================
-- SECURITY TRIGGERS
-- ==========================================

-- Prevent non-admins from changing their own role
CREATE OR REPLACE FUNCTION public.restrict_role_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'admin' THEN
            RAISE EXCEPTION 'Only administrators can change roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_restrict_role_update ON public.profiles;
CREATE TRIGGER tr_restrict_role_update
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.restrict_role_update();
