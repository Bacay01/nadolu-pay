import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "Nimbus_admin_session";

export function createAdminToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "12h",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.ADMIN_JWT_SECRET);
  } catch {
    return null;
  }
}