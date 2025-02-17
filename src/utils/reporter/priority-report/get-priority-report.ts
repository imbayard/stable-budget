import { CONFIG } from '../../../config'
import {
  AmountReportForSubsection,
  TransactionEntry,
} from '../../../types/types'
import { getRankedAmountsByKey } from '../utils/get-ranked-amounts-by-key'

export const getPriorityReport = (transactions: TransactionEntry[]) => {
  const sortedPriorities = getRankedAmountsByKey('priority', transactions, true)

  const reports = sortedPriorities.map((rep, i) =>
    reportOnAPriority(rep.key, rep.amount, i + 1)
  )

  const markdown = writeMarkdownReport(reports)
  return markdown
}

/**
 * A very simple function to report on a priority
 *
 * @param {string} name the name of the priority
 * @param {number} total the total amount spent in this priority over the timeframe
 * @param {number} ranking the ranking of this priority over the timeframe (#1 is the one that earned you the most money)
 * @returns {PriorityReport} the report
 */
const reportOnAPriority = (
  name: string,
  total: number,
  ranking: number
): PriorityReport => {
  const expectedRank =
    CONFIG.PRIORITIES_RANKED.findIndex((str) => str === name) + 1

  return {
    name,
    total,
    ranking,
    expectedRank,
    miss: expectedRank - ranking,
  }
}

const writeMarkdownReport = (reports: PriorityReport[]) => {
  let markdown = `## Priority Report\n\n`
  markdown += `| Priority | Total Earned ($) | Ranking | Expected Rank | Miss (Difference) |\n`
  markdown += `|----------|---------------|---------|--------------|-----------------|\n`

  // Populate table rows
  reports
    .filter((rep) => rep.name !== 'NA')
    .forEach(({ name, total, ranking, expectedRank, miss }) => {
      markdown += `| ${name} | $${total.toFixed(
        2
      )} | ${ranking} | ${expectedRank} | ${miss} |\n`
    })

  markdown += `\n### Keep a better eye on:\n ${reports
    .filter((rep) => rep.name !== 'NA')
    .sort((a, b) => Math.abs(b.miss) - Math.abs(a.miss))
    .slice(0, 5)
    .map((rep) => `***- ${rep.name}*** ($${rep.total.toFixed(2)})`)
    .join('\n\n')}`

  markdown += ``
  return markdown
}

type PriorityReport = AmountReportForSubsection & {
  expectedRank: number
  miss: number
}
