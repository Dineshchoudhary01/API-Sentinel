
INSERT INTO workspaces (name) VALUES ('Test Workspace') ON CONFLICT DO NOTHING;
INSERT INTO users (name, email, password_hash) VALUES ('Admin', 'admin@example.com', 'hash123') ON CONFLICT DO NOTHING;
INSERT INTO workspace_members (user_id, workspace_id, role) VALUES (1, 1, 'owner') ON CONFLICT DO NOTHING;
INSERT INTO services (workspace_id, name, environment) VALUES (1, 'Auth Service', 'prod') ON CONFLICT DO NOTHING;
