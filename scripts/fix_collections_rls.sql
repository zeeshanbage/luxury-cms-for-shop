-- ============================================================
-- FIX: Collections table missing write RLS policies
-- Run this in your Supabase SQL editor for BOTH projects
-- (fashionking & seemasarees) to fix DELETE / UPDATE / INSERT
-- on the collections table.
-- ============================================================

-- Add WRITE policies for collections table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public insert') THEN
        CREATE POLICY "Allow public insert" ON collections FOR INSERT TO public WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public update') THEN
        CREATE POLICY "Allow public update" ON collections FOR UPDATE TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public delete') THEN
        CREATE POLICY "Allow public delete" ON collections FOR DELETE TO public USING (true);
    END IF;
END
$$;

-- Verify policies are now in place
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'collections'
ORDER BY cmd;
