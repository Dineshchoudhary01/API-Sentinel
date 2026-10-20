CREATE TABLE IF NOT EXISTS workspaces (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

  CREATE TABLE IF NOT EXISTS workspace_members(
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
     ROLE TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'viewer')),
     joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     PRIMARY KEY (user_id,workspace_id)
  );

  CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace
   ON workspace_members (workspace_id);

   CREATE TABLE IF NOT EXISTS services (
     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     environment TEXT NOT NULL CHECK (environment IN ('prod', 'staging', 'dev')),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     UNIQUE (workspace_id, name)
   );

   CREATE TABLE IF NOT EXISTS api_keys (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT noW(),
      last_used_at TIMESTAMPTZ,
      revoked_at TIMESTAMPTZ
   );
