import { loadTransactionsFromCSV } from './utils/loader/load-transactions'
import { getCategoryReport } from './utils/reporter/category-report/get-category-report'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { writeReport } from './utils/reporter/write-report'

export const main = () =>
  pipe(
    loadTransactionsFromCSV(),
    E.map(getCategoryReport),
    E.map((reports) => writeReport([reports]))
  )
