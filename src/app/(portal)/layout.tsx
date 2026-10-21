import type { ReactNode } from "react";

import { AppShell } from "@/components/portal/app-shell";
import { requireSession } from "@/lib/auth/session";
import { dataSourceKind } from "@/lib/data/source";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return <AppShell source={dataSourceKind(process.env.INVESTOR_DATA_SOURCE)}>{children}</AppShell>;
}
