import * as t from 'io-ts'
import { NumberFromString } from '../utils/io-ts/custom-decoders'

const RecurrenceType = t.union([
  t.literal('Daily'),
  t.literal('Weekly'),
  t.literal('Bi-Weekly'),
  t.literal('Monthly'),
  t.literal('Yearly'),
  t.literal(''),
])

const TransactionEntryCodec = t.type({
  date: t.string, // Expecting YYYY-MM-DD format (validation can be extended)
  payment_method: t.string,
  amount: NumberFromString,
  merchant: t.string,
  /* Which priority led to this purchase (eg. Personal Growth, Boston Friends) */
  priority: t.string,
  /* Which budgeting category led to this purchase (eg. Food, Vacation, Drinks) */
  category: t.string,
  /* What event (if any) led to this purchase (eg. Valentine's Day) */
  event: t.union([t.string, t.undefined]),
  recurs: t.union([RecurrenceType, t.undefined]),
})

// Define the array of transactions
export const TransactionsCodec = t.array(TransactionEntryCodec)

export type TransactionEntry = t.TypeOf<typeof TransactionEntryCodec>
