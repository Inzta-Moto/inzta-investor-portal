import { agreementMonthKey, formatMonth } from "@/lib/format/dates";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiah } from "@/lib/money/rupiah";

import { StatusChip } from "./status-chip";

function splitTotal(percents: (number | null)[]): string {
  // The 100% row is only claimed when all three shares are entered and add up; otherwise show what is known.
  if (percents.some((value) => value === null)) return "–";
  return formatPercent(percents.reduce<number>((sum, value) => sum + (value ?? 0), 0));
}

/** Same columns as the table in Pasal 5 of the agreement, plus what has actually come in. */
export function RepaymentTable({ portfolio }: { portfolio: Portfolio }) {
  const { items, totals } = portfolio.repayment;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Jadwal pengembalian dana sesuai Pasal 5 perjanjian</caption>
        <thead>
          <tr className="bg-surface-sunk text-left text-xs font-semibold text-ink-3">
            <th scope="col" className="px-4 py-3 lg:px-5">Pengembalian</th>
            <th scope="col" className="px-4 py-3 lg:px-5">Jatuh tempo</th>
            <th scope="col" className="px-4 py-3 text-right lg:px-5">Persentase</th>
            <th scope="col" className="px-4 py-3 text-right lg:px-5">Jumlah</th>
            <th scope="col" className="px-4 py-3 text-right lg:px-5">Sudah masuk</th>
            <th scope="col" className="px-4 py-3 lg:px-5">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const month = agreementMonthKey(portfolio.effectiveDate, item.dueMonth);
            return (
              <tr key={item.number} className="border-t border-line whitespace-nowrap">
                <th scope="row" className="px-4 py-3 text-left font-bold lg:px-5">Ke-{item.number}</th>
                <td className="px-4 py-3 lg:px-5">
                  Bulan ke-{item.dueMonth}
                  {month ? <span className="text-ink-3"> · {formatMonth(month)}</span> : null}
                </td>
                <td className="tabular px-4 py-3 text-right lg:px-5">{item.percentBasisPoints !== null ? formatPercent(item.percentBasisPoints) : "–"}</td>
                <td className="tabular px-4 py-3 text-right lg:px-5">{item.amount !== null ? formatRupiah(item.amount) : "–"}</td>
                <td className="tabular px-4 py-3 text-right font-semibold lg:px-5">{formatRupiah(item.paidAmount)}</td>
                <td className="px-4 py-3 lg:px-5">
                  <StatusChip status={item.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-line-strong font-bold whitespace-nowrap">
            <th scope="row" className="px-4 py-3 text-left lg:px-5">Jumlah</th>
            <td className="px-4 py-3 lg:px-5" />
            <td className="tabular px-4 py-3 text-right lg:px-5">{splitTotal(items.map((item) => item.percentBasisPoints))}</td>
            <td className="tabular px-4 py-3 text-right lg:px-5">{formatRupiah(totals.total)}</td>
            <td className="tabular px-4 py-3 text-right lg:px-5">{formatRupiah(totals.returned)}</td>
            <td className="px-4 py-3 text-ink-3 lg:px-5">{formatPercent(totals.returnedBasisPoints)} kembali</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
