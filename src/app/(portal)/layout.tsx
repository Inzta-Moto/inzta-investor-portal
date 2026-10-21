import type { ReactNode } from "react";

import { AppShell } from "@/components/portal/app-shell";
import { requireSession } from "@/lib/auth/session";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return <AppShell>{children}</AppShell>;
}
