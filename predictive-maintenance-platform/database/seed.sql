-- ROLES
INSERT INTO public.roles (id, name)
VALUES (1, 'Vehicle Owner'),
    (2, 'Service Center Admin'),
    (3, 'Manufacturer'),
    (4, 'System Admin');
-- NOTE: Users must be created via Auth API, these are placeholders for reference in code
-- or if you manually insert into auth.users then insert here.
-- For hackathon seed script usually assumes auth.users exists or connects via code.
-- Here we'll just insert some dummy vehicles assuming a placeholder owner UUID if needed,
-- Or more commonly, the python seeder script handles the UUID mapping.
-- For this SQL file, we will purely seed constant data.
-- We can't easily seed relational data with foreign keys to auth.users without knowing generated UUIDs.
-- So I will provide a Python script 'seed.py' in the backend to handle robust seeding via API.
