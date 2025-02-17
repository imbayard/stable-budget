import * as fs from 'fs'
import { CONFIG } from '../../config'

export const writeReport = (reports: string[]) => {
  const fullReport = getFullReportString(reports)

  fs.writeFileSync(CONFIG.REPORT_MARKDOWN_FILENAME, fullReport)
}

const getFullReportString = (reports: string[]) => reports.join('\n\n')
