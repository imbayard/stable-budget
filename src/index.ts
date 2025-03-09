import { loadTransactionsFromCSV } from './utils/loader/load-transactions'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { DateRange } from './types/types'
import express from 'express'
import moment from 'moment'
import cors from 'cors'
import { saveTransaction } from './utils/writer/save-transaction'
import { loadUser } from './utils/loader/load-user'
import { savePurpose } from './utils/writer/save-purpose'

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
  console.log('Fetch Beginning')
  const dateRange: DateRange = req.body.dateRange || {
    start: '2025-01-01',
    end: moment().format('YYYY-MM-DD'),
  }
  try {
    const result = await main(dateRange)({})()
    res.status(200).json(result)
    console.log('Fetch completed successfully')
  } catch (error) {
    console.log('Error:', error)
    res.status(500).json({ error })
  }
})

app.post('/create/transaction', async (req, res) => {
  console.log('Transaction update beginning', req.body)
  try {
    const result = await saveTransaction(req.body)()
    res.status(200).json({ message: result.toString() })
    console.log('Transaction saved successfully')
  } catch (error) {
    console.log('Error:', error)
    res.status(500).json({ error })
  }
})

app.get('/user', async (req, res) => {
  console.log('User fetch beginning')
  try {
    const result = loadUser()
    res.status(200).json(result)
    console.log('User fetch completed successfully')
  } catch (error) {
    console.log('Error:', error)
    res.status(500).json({ error })
  }
})

app.post('/declare-purpose', async (req, res) => {
  console.log('Setting purpose')
  try {
    savePurpose(req.body)
    res.status(200).json(true)
    console.log('Set purpose was successful')
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
