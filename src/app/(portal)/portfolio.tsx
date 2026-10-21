import { AlertIcon } from "@/components/icons";
import { AutoRefresh } from "@/components/portal/auto-refresh";
import { PortfolioView, type PortalView } from "@/components/portal/views";
import { requireSession } from "@/lib/auth/session";
import { loadPortfolio } from "@/lib/data/load";

/**
 * Checks the session at the data access point, because layouts are not re-rendered on client navigation, then
 * renders Firestore data read on the server (ADR-0006).
 */
export async function PortfolioPage({ view }: { view: PortalView }) {
  await requireSession();
  const result = await loadPortfolio();
  if (!result.ok) {
    return (
      <div role="alert" className="grid justify-items-start gap-2.5 rounded-xl border border-line bg-surface p-5">
        <span className="grid size-10 place-items-center rounded-[10px] bg-warn-soft text-warn">
          <AlertIcon />
        </span>
        <p className="font-bold">Data investasi belum siap</p>
        <p className="text-sm text-ink-2">{result.reason} Hubungi admin Inzta.</p>
      </div>
    );
  }
  return (
    <>
      <AutoRefresh updatedAt={result.updatedAt} />
      <PortfolioView view={view} portfolio={result.portfolio} />
    </>
  );
}
