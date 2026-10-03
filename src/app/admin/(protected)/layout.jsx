import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-page">
      <AdminHeader adminName={admin.name} />
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}