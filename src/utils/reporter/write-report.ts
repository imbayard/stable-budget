import * as fs from 'fs'
import { CONFIG } from '../../config'
import { DateRange } from '../../types/types'
import moment from 'moment'

export const writeReport = (reports: string[], dateRange?: DateRange) => {
  const fullReport = getFullReportString(reports, dateRange)

  fs.writeFileSync(CONFIG.REPORT_MARKDOWN_FILENAME, fullReport)
}

const getFullReportString = (reports: string[], dateRange?: DateRange) => `
# Report${dateRange ? getDateRange(dateRange) : ''}
- [Category Report](#category-report)
- [Priority Report](#priority-report)
- [Events Report](#events-report)
${reports.join('\n\n')}
`

const getDateRange = (dateRange: DateRange) =>
  ` From _${moment(dateRange.start).format('MMMM D, YYYY')} - ${moment(
    dateRange.end
  ).format('MMMM D, YYYY')}_`
