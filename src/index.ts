import { loadTransactionsFromCSV } from './utils/loader/load-transactions'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { DateRange } from './types/types'
import express from 'express'
import moment from 'moment'
import cors from 'cors'

export const main = (dateRange?: DateRange) =>
  pipe(
    loadTransactionsFromCSV(dateRange),
    RTE.fromEither,
    RTE.bindTo('txns'),
    RTE.map(({ txns }) => ({
      transactions: txns,
    })),
    RTE.getOrElse((e) => {
      throw e
    })
  )

const app = express()
app.use(cors())
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
