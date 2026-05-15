import type { QueryResultRow } from "pg";
import { query } from "../../database/connection.js";

export type SessionUserRow = {
  id: string;
  institutional_email: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  role_code: string;
  role_name: string;
};

function mapSessionUser(row: QueryResultRow): SessionUserRow {
  return {
    id: String(row.id),
    institutional_email: String(row.institutional_email),
    display_name: String(row.display_name),
    avatar_url: row.avatar_url === null || row.avatar_url === undefined ? null : String(row.avatar_url),
    is_active: Boolean(row.is_active),
    role_code: String(row.role_code),
    role_name: String(row.role_name)
  };
}

export async function findSessionUserById(userId: string): Promise<SessionUserRow | null> {
  const result = await query(
    `SELECT u.id, u.institutional_email, u.display_name, u.avatar_url, u.is_active,
            r.code AS role_code, r.name AS role_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE u.id = $1::uuid
     LIMIT 1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapSessionUser(result.rows[0]);
}

export async function findUserByGoogleSub(googleSub: string): Promise<SessionUserRow | null> {
  const result = await query(
    `SELECT u.id, u.institutional_email, u.display_name, u.avatar_url, u.is_active,
            r.code AS role_code, r.name AS role_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE u.google_sub = $1
     LIMIT 1`,
    [googleSub]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapSessionUser(result.rows[0]);
}

export async function findUserByInstitutionalEmail(email: string): Promise<SessionUserRow | null> {
  const result = await query(
    `SELECT u.id, u.institutional_email, u.display_name, u.avatar_url, u.is_active,
            r.code AS role_code, r.name AS role_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE lower(u.institutional_email) = lower($1)
     LIMIT 1`,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapSessionUser(result.rows[0]);
}

export async function findSessionUserByPassword(
  institutionalEmail: string,
  plainPassword: string
): Promise<SessionUserRow | null> {
  const result = await query(
    `SELECT u.id, u.institutional_email, u.display_name, u.avatar_url, u.is_active,
            r.code AS role_code, r.name AS role_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE lower(u.institutional_email) = lower($1)
       AND u.password_hash IS NOT NULL
       AND u.password_hash = crypt($2::text, u.password_hash)
       AND u.is_active = TRUE
     LIMIT 1`,
    [institutionalEmail, plainPassword]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapSessionUser(result.rows[0]);
}

export async function linkGoogleAccount(input: {
  userId: string;
  googleSub: string;
  avatarUrl: string | null;
}): Promise<void> {
  await query(
    `UPDATE users
     SET google_sub = $2,
         avatar_url = COALESCE($3, avatar_url),
         last_login_at = NOW(),
         updated_at = NOW()
     WHERE id = $1::uuid`,
    [input.userId, input.googleSub, input.avatarUrl]
  );
}

export async function createUserFromGoogle(input: {
  googleSub: string;
  institutionalEmail: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string | null;
}): Promise<SessionUserRow> {
  const roleResult = await query(`SELECT id FROM roles WHERE code = 'student' LIMIT 1`);

  if (roleResult.rows.length === 0) {
    throw new Error("Rol student no encontrado en la base de datos");
  }

  const roleId = roleResult.rows[0].id;

  const insert = await query(
    `INSERT INTO users (
       google_sub,
       institutional_email,
       first_name,
       last_name,
       display_name,
       role_id,
       carrera_id,
       ceal_id,
       avatar_url,
       is_active,
       last_login_at
     )
     VALUES ($1, $2, $3, $4, $5, $6::uuid, NULL, NULL, $7, TRUE, NOW())
     RETURNING id`,
    [
      input.googleSub,
      input.institutionalEmail,
      input.firstName,
      input.lastName,
      input.displayName,
      roleId,
      input.avatarUrl
    ]
  );

  const id = String(insert.rows[0].id);
  const user = await findSessionUserById(id);

  if (!user) {
    throw new Error("No fue posible cargar el usuario recién creado");
  }

  return user;
}

export async function touchLastLogin(userId: string): Promise<void> {
  await query(`UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1::uuid`, [userId]);
}
