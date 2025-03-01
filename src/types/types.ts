import * as t from 'io-ts'
import {
  DefaultToUndefinedIfEmptyString,
  NumberFromString,
} from '../utils/io-ts/custom-decoders'
import { CategoryTypeCodec, RecurrenceType } from './constants'

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
  event: DefaultToUndefinedIfEmptyString,
  recurs: t.union([RecurrenceType, t.undefined]),
})

// Define the array of transactions
export const TransactionsCodec = t.array(TransactionEntryCodec)

export type TransactionEntry = t.TypeOf<typeof TransactionEntryCodec>

export type TransactionResponse = {
  date: string
  payment_method: string
  amount: number
  merchant: string
  priority: string[]
  category: string[]
  event?: string
  recurs?: string
}

export type AmountReportForSubsection = {
  name: string
  total: number
  ranking: number
}

export type DateRange = { start: string; end: string }

export const TransactionsInputCodec = t.type({
  date: t.string, // Expecting YYYY-MM-DD format (validation can be extended)
  payment_method: t.string,
  amount: NumberFromString,
  merchant: t.string,
  /* Which priority led to this purchase (eg. Personal Growth, Boston Friends) */
  priority: t.array(t.string),
  /* Which budgeting category led to this purchase (eg. Food, Vacation, Drinks) */
  category: t.array(t.string),
  /* What event (if any) led to this purchase (eg. Valentine's Day) */
  event: DefaultToUndefinedIfEmptyString,
  recurs: t.union([RecurrenceType, t.undefined]),
})
