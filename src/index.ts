import { loadTransactionsFromCSV } from './utils/loader/load-transactions'
import { getCategoryReport } from './utils/reporter/category-report/get-category-report'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { writeReport } from './utils/reporter/write-report'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { getPriorityReport } from './utils/reporter/priority-report/get-priority-report'
import { DateRange } from './types/types'
import { getEventReport } from './utils/reporter/event-report/get-event-report'
import express from 'express'
import moment from 'moment'

export const main = (dateRange?: DateRange) =>
  pipe(
    loadTransactionsFromCSV(dateRange),
    RTE.fromEither,
    RTE.bindTo('txns'),
    RTE.bindW('reports', ({ txns }) =>
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
    RTE.map(({ reports, txns }) => ({
      report: writeReport(reports),
      transactions: txns,
    })),
    RTE.getOrElse((e) => {
      throw e
    })
  )

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/api/main', async (req, res) => {
  const dateRange: DateRange = req.body.dateRange || {
    start: '2025-01-01',
    end: moment().format('YYYY-MM-DD'),
  }
  try {
    const result = await main(dateRange)({})()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
