import { TransactionEntry } from '../../../types/types'

/**
 * Maps the transactions to a sorted array where the #1 ranked entry is the highest earning subsection
 *
 * @param subsection the subsection of the transaction entry item to report on
 * @param txns the transactions to report on
 * @returns an array of the subsections sorted by their total earnings
 */
export const getRankedAmountsByKey = (
  subsection: keyof TransactionEntry,
  txns: TransactionEntry[],
  doAbsoluteValue: boolean = false
): { key: string; amount: number }[] => {
  const totals = {} as Record<string, number>

  // Collect category totals
  txns.map((txn) => {
    const value = txn[subsection] || 'NA'

    if (!totals[value]) {
      totals[value] = txn.amount
    } else {
      totals[value] = totals[value] + txn.amount
    }
  })
  return Object.entries(totals)
    .map(([category, amount]) => ({ key: category, amount }))
    .sort(
      (a, b) =>
        (doAbsoluteValue ? Math.abs(b.amount) : b.amount) -
        (doAbsoluteValue ? Math.abs(a.amount) : a.amount)
    )
}
