import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "../components/admin-shell";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminWorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const session = verifyAdminSession(jar.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
