import * as fs from 'fs'
import { parse } from 'csv-parse/sync'
import { pipe } from 'fp-ts/lib/function'
import {
  DateRange,
  TransactionEntry,
  TransactionsCodec,
} from '../../types/types'
import * as E from 'fp-ts/Either'
import { BadTypeError } from '../../types/error-types'
import { CONFIG } from '../../config'
import moment from 'moment'

export const loadTransactionsFromCSV = (
  dateRange?: DateRange
): E.Either<BadTypeError, TransactionEntry[]> => {
  const fileContent = fs.readFileSync(
    CONFIG.TRANSACTION_INPUT_CSV_FILENAME,
    'utf-8'
  )

  const records: unknown[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return pipe(
    records,
    TransactionsCodec.decode,
    E.mapLeft((e) => {
      console.log('Error', JSON.stringify(e[0], null, 2))
      return new BadTypeError()
    }),
    E.map((txns) => {
      console.log('Transactions Parsed Successfully')

      return txns
        .map((txn) => ({
          ...txn,
          recurs: txn.recurs === '' ? undefined : txn.recurs,
        }))
        .filter((txn) =>
          dateRange ? isTransactionInDateRange(dateRange, txn.date) : true
        )
    })
  )
}

const isTransactionInDateRange = (
  dateRange: DateRange,
  transactionDate: string
) => {
  return (
    moment(transactionDate).isAfter(moment(dateRange.start)) &&
    moment(transactionDate).isBefore(moment(dateRange.end))
  )
}
