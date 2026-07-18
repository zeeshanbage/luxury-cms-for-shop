# Workspace Rules: Fashion King Project

As the AI coding assistant for this workspace, you must adhere to the following rules and project guidelines:

1. **Read Project Context First**:
   - Before proposing changes or performing research, read the main [PROJECT_CONTEXT.md](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/PROJECT_CONTEXT.md) in the project root. It outlines the core features, hybrid database schema, local database fallback mechanism, and directory mapping.

2. **Respect the Hybrid Database & Config System**:
   - The application functions in two modes depending on Supabase configuration. Always write service changes in [db.ts](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/services/db.ts) that gracefully handle the lack of a database connection by returning mock datasets or values from `src/config/` and falling back to `localStorage`.
   - Never write logic that completely breaks or errors out if `supabase` is `null`.

3. **Adhere to the Premium Luxury Design System**:
   - **Colors**: Use `#030303` (pure/deep black) for backgrounds (`bg-luxury-black`) and `#C5A880` (metallic gold) for accents. Do not introduce generic red/blue/green/yellow colors.
   - **Fonts**: Headings must use `Cormorant Garamond` or `Playfair Display` serif fonts. Body text and controls must use `Outfit` or `Inter`.
   - **Glassmorphism**: Use `.glass-nav` and `.glass-card` classes with soft transitions (`.glass-card-hover`).

4. **Routing**:
   - Public pages: `/` (Home), `/contact`.
   - Admin page: `/admin` (a secret routing configuration in [router.tsx](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/config/router.tsx)).

5. **Linting & Code Integrity**:
   - Ensure clean compilation with TypeScript and run `npm run build` to verify changes.
   - Preserve all existing code comments, docstrings, and layout structure unless explicitly instructed otherwise.

6. **Supabase RLS (Row Level Security) — MANDATORY FOR EVERY NEW TABLE**:
   - **The Supabase portal has RLS enabled by default.** Any table created without explicit write policies will silently return `204 No Content` on DELETE/UPDATE/INSERT but mutate **zero rows**. This is a silent failure that is very hard to debug.
   - **Every time a new table is added to [supabase_schema.sql](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/supabase_schema.sql), you MUST immediately append the corresponding RLS policies block below the table definition.**
   - Use the following template for every new table (replace `<table_name>`):
     ```sql
     -- RLS: Enable and set policies for <table_name>
     ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

     DO $$
     BEGIN
         -- Public read (always required)
         IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '<table_name>' AND policyname = 'Allow public select') THEN
             CREATE POLICY "Allow public select" ON <table_name> FOR SELECT TO public USING (true);
         END IF;
         -- Write policies (required if the app mutates this table)
         IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '<table_name>' AND policyname = 'Allow public insert') THEN
             CREATE POLICY "Allow public insert" ON <table_name> FOR INSERT TO public WITH CHECK (true);
         END IF;
         IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '<table_name>' AND policyname = 'Allow public update') THEN
             CREATE POLICY "Allow public update" ON <table_name> FOR UPDATE TO public USING (true) WITH CHECK (true);
         END IF;
         IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '<table_name>' AND policyname = 'Allow public delete') THEN
             CREATE POLICY "Allow public delete" ON <table_name> FOR DELETE TO public USING (true);
         END IF;
     END
     $$;
     ```
   - **Always add RLS-aware error detection in [db.ts](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/services/db.ts)** for any write service function on a new table:
     - For DELETE: use `delete({ count: 'exact' })` and throw if `count === 0`.
     - For UPDATE: check if returned `data` is null / error code `PGRST116` and throw a descriptive error.
     - For INSERT: check for error code `42501` or message containing `"policy"`.
   - **Diagnosis tip**: If a Supabase write operation returns 204 but nothing changes in the DB, it is always an RLS policy problem. Run `SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = '<table_name>';` in the SQL editor to verify.
