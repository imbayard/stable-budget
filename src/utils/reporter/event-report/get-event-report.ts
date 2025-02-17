import { TransactionEntry } from '../../../types/types'
import { getRankedAmountsByKey } from '../utils/get-ranked-amounts-by-key'

export const getEventReport = (txns: TransactionEntry[]) => {
  const sortedByEventTotal = getRankedAmountsByKey('event', txns)
    .filter((event) => event.key !== 'NA')
    .reverse()

  return writeEventReports(sortedByEventTotal)
}

const writeEventReports = (eventReports: { key: string; amount: number }[]) => {
  let markdown = `## Events Report\n\n`
  markdown += `| Event | Amount ($) |\n`
  markdown += `|------------|------------|\n`

  // Populate table rows
  eventReports.forEach(({ key, amount }) => {
    markdown += `| ${key} | $${amount.toFixed(2)} |\n`
  })

  return markdown
}
