import { loadTransactionsFromCSV } from '../../loader/load-transactions'
import { getCategoryReport } from './get-category-report'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'

describe('get-category-report', () => {
  it('should report on categories', () => {
    pipe(loadTransactionsFromCSV(), E.map(getCategoryReport))
  })
})
