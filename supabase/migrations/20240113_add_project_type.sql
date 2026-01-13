-- Migration to add type column to projects table
-- Default to 'FORM' for existing records
ALTER TABLE projects 
ADD COLUMN type text NOT NULL DEFAULT 'FORM' CHECK (type IN ('FORM', 'LANDING_PAGE'));

-- Comment on column
COMMENT ON COLUMN projects.type IS 'Type of the project: FORM or LANDING_PAGE';
