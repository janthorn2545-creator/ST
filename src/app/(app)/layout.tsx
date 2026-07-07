import { getCurrentUser } from "@/lib/dal";
import { getVisibleModuleKeys, MODULE_META } from "@/lib/modules";
import { AppChrome, type NavItem } from "@/components/AppChrome";
import { FileText, TriangleAlert, Pill, Link2 } from "lucide-react";

const MODULE_ICONS = {
  documents: <FileText className="h-5 w-5" />,
  accidents: <TriangleAlert className="h-5 w-5" />,
  medications: <Pill className="h-5 w-5" />,
  external: <Link2 className="h-5 w-5" />,
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const visibleKeys = await getVisibleModuleKeys(user.role);

  const navItems: NavItem[] = Object.entries(MODULE_META)
    .filter(([key]) => visibleKeys.has(key as keyof typeof MODULE_META))
    .map(([key, meta]) => ({
      href: meta.href,
      label: meta.label,
      icon: MODULE_ICONS[key as keyof typeof MODULE_ICONS],
    }));

  return (
    <AppChrome navItems={navItems} isAdmin={user.role === "ADMIN"} name={user.name} role={user.role}>
      {children}
    </AppChrome>
  );
}
