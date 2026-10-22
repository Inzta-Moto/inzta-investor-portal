import { AlertIcon } from "@/components/icons";
import { AutoRefresh, RetryWhenReady } from "@/components/portal/auto-refresh";
import { PortfolioView, type PortalView } from "@/components/portal/views";
import { requireSession } from "@/lib/auth/session";
import { QUOTA_MESSAGE, isQuotaError } from "@/lib/data/firestore-source";
import { loadFundUsage, loadPortfolio, loadSalesView, type FundUsageView, type SalesView } from "@/lib/data/load";

/**
 * Checks the session at the data access point, because layouts are not re-rendered on client navigation, then
 * renders Firestore data read on the server (ADR-0006).
 */
export async function PortfolioPage({ view, searchParams = {} }: { view: PortalView; searchParams?: Record<string, string | string[] | undefined> }) {
  await requireSession();
  const result = await loadPortfolio();
  let sales: SalesView | undefined;
  let fundUsage: FundUsageView | undefined;
  let reason = result.ok ? null : result.reason;
  if (result.ok && (view === "penjualan" || view === "penggunaan-dana")) {
    try {
      if (view === "penjualan") sales = await loadSalesView(searchParams);
      else fundUsage = await loadFundUsage();
    } catch (error) {
      if (!isQuotaError(error)) throw error;
      reason = QUOTA_MESSAGE;
    }
  }
  if (reason !== null || !result.ok) {
    return (
      <div role="alert" className="grid justify-items-start gap-2.5 rounded-xl border border-line bg-surface p-5">
        <span className="grid size-10 place-items-center rounded-[10px] bg-warn-soft text-warn">
          <AlertIcon />
        </span>
        <p className="font-bold">Data investasi belum siap</p>
        <p className="text-sm text-ink-2">{reason} Hubungi admin Inzta.</p>
        <RetryWhenReady />
      </div>
    );
  }
  return (
    <>
      <AutoRefresh updatedAt={result.updatedAt} />
      <PortfolioView view={view} portfolio={result.portfolio} sales={sales} fundUsage={fundUsage} />
    </>
  );
}
