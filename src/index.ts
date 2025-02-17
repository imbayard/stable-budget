import { loadTransactionsFromCSV } from './utils/loader/load-transactions'
import { getCategoryReport } from './utils/reporter/category-report/get-category-report'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { writeReport } from './utils/reporter/write-report'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { getPriorityReport } from './utils/reporter/priority-report/get-priority-report'
import { DateRange } from './types/types'
import { getEventReport } from './utils/reporter/event-report/get-event-report'

export const main = (dateRange?: DateRange) =>
  pipe(
    loadTransactionsFromCSV(dateRange),
    RTE.fromEither,
    RTE.chainW((txns) =>
      pipe(
        RTE.Do,
        RTE.apSW('categoryReport', RTE.right(getCategoryReport(txns))),
        RTE.apSW('priorityReport', RTE.right(getPriorityReport(txns))),
        RTE.apSW('eventReport', RTE.right(getEventReport(txns))),
        RTE.map((ctx) => [
          ctx.categoryReport,
          ctx.priorityReport,
          ctx.eventReport,
        ])
      )
    ),
    RTE.map((reports) => writeReport(reports, dateRange))
  )
