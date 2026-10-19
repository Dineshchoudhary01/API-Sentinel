INSERT INTO workspaces (name) VALUES ('Acme Team'), ('Test Workspace') ON CONFLICT DO NOTHING;
