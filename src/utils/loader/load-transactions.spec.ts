import { loadTransactionsFromCSV } from './load-transactions'

describe('load-transactions', () => {
  it('should load txns', () => {
    const txns = loadTransactionsFromCSV({
      start: '2025-02-01',
      end: '2025-02-28',
    })
    console.log(txns)
    expect(txns._tag).toEqual('Right')
  })
})
