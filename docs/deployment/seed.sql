-- ============================================================
-- Approval Inbox — Seed Data (for development/testing)
-- ============================================================

-- Seed a demo project (replace USER_ID with actual user ID)
-- INSERT INTO projects (name, description, owner_id)
-- VALUES ('Website Redesign', 'Redesign of the main landing page', 'REPLACE_WITH_USER_ID');

-- Seed a project member with share token
-- INSERT INTO project_members (project_id, user_id, role, share_token)
-- VALUES (
--   (SELECT id FROM projects WHERE name = 'Website Redesign' LIMIT 1),
--   NULL,
--   'client',
--   'demo-share-token-123'
-- );