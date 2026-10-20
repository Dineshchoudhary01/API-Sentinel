INSERT INTO users (name, email, password_hash) VALUES ('B', 'a@x.com', 'xyz');          -- unique error
INSERT INTO workspace_members (user_id, workspace_id, role) VALUES (1, 1, 'boss');      -- check error
INSERT INTO services (workspace_id, name, environment) VALUES (999, 'X', 'prod');       -- foreign key error