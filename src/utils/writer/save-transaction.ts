import { pipe } from 'fp-ts/lib/function'
import { TransactionsInputCodec } from '../../types/types'
import * as TE from 'fp-ts/TaskEither'
import * as fs from 'fs'
import { CONFIG } from '../../config'

export const saveTransaction = (transaction: any) =>
  pipe(
    transaction,
    TransactionsInputCodec.decode,
    TE.fromEither,
    TE.map((txn) => ({
      ...txn,
      category: txn.category.join(','),
      priority: txn.priority.join(','),
      recurs: txn.recurs || '',
    })),
    TE.chainW((txn) => {
      const transactionsFile = fs.readFileSync(
        CONFIG.TRANSACTION_INPUT_CSV_FILENAME,
        'utf-8'
      )
      const transactionString = `${txn.date},${txn.payment_method},${
        txn.amount
      },${txn.merchant},"${txn.priority}",${txn.event || ''},"${
        txn.category
      }",${txn.recurs === '' || !txn.recurs ? ' ' : txn.recurs}`

      fs.writeFileSync(
        CONFIG.TRANSACTION_INPUT_CSV_FILENAME,
        `${transactionsFile}\n${transactionString} `
      )

      return TE.right('Transaction saved successfully')
    }),
    TE.mapLeft((e) => {
      throw new Error('Error saving transaction: ' + e)
    })
  )
