import {
  CategoryReportForCategory,
  TransactionEntry,
} from '../../../types/types'

export const getCategoryReport = (txns: TransactionEntry[]) => {
  const categoryTotals = {} as Record<string, number>

  // Collect category totals
  txns.map((txn) => {
    const { category, amount, date } = txn
    if (!categoryTotals[category]) {
      categoryTotals[category] = amount
    } else {
      categoryTotals[category] = categoryTotals[category] + amount
    }
  })

  /**
   * Sorted in descending order (highest amount is at position 0 aka the category that netted the most money)
   * Category that had the biggest defecit (what you spent most on) is in the last position
   *
   * tl;dr the #1 ranked category is the one that got u the most money
   */
  const sortedCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const reports = sortedCategories.map((cat, i) =>
    reportOnACategory(cat.category, cat.amount, i + 1)
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
 * @returns {CategoryReportForCategory} the report
 */
const reportOnACategory = (
  name: string,
  total: number,
  ranking: number
): CategoryReportForCategory => {
  return {
    name,
    total,
    ranking,
  }
}

const generateMarkdownCategoryReport = (
  reports: CategoryReportForCategory[]
) => {
  const sortedReports = reports.sort((a, b) => a.ranking - b.ranking) // Ensure correct ranking order

  const tableHeader = `| Ranking | Category | Total Spent  |\n|---------|--------------|-------------|`
  const tableRows = sortedReports
    .map(
      ({ ranking, name, total }) =>
        `| #${ranking}  | ${name} | $${total.toFixed(2)} |`
    )
    .join('\n')

  return `# Category Report
    
${tableHeader}
${tableRows}`
}
