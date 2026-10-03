import { getAdminSession } from "@/lib/adminAuth";

export async function requireAdmin() {
  return getAdminSession();
}