import {
  AmountReportForSubsection,
  TransactionEntry,
} from '../../../types/types'
import { getRankedAmountsByKey } from '../utils/get-ranked-amounts-by-key'

export const getCategoryReport = (txns: TransactionEntry[]) => {
  const sortedCategories = getRankedAmountsByKey('category', txns)

  const reports = sortedCategories.map((cat, i) =>
    reportOnACategory(cat.key, cat.amount, i + 1)
  )

  const markdownReport = generateMarkdownCategoryReport(reports)

  return markdownReport
}

/**
 * A very simple function to report on a category
 *
 * Can be expanded in the future with more jazz
 *
 * @param {string} name the name of the category
 * @param {number} total the total amount spent in this category over the timeframe
 * @param {number} ranking the ranking of this category over the timeframe (#1 is the one that earned you the most money)
 * @returns {AmountReportForSubsection} the report
 */
const reportOnACategory = (
  name: string,
  total: number,
  ranking: number
): AmountReportForSubsection => {
  return {
    name,
    total,
    ranking,
  }
}

const generateMarkdownCategoryReport = (
  reports: AmountReportForSubsection[]
) => {
  const sortedReports = reports.sort((a, b) => a.ranking - b.ranking) // Ensure correct ranking order

  const tableHeader = `| Ranking | Category | Total Earned  |\n|---------|--------------|-------------|`
  const tableRows = sortedReports
    .map(
      ({ ranking, name, total }) =>
        `| #${ranking}  | ${name} | $${total.toFixed(2)} |`
    )
    .join('\n')

  return `## Category Report
    
${tableHeader}
${tableRows}`
}
