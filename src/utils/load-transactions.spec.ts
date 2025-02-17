import { loadTransactionsFromCSV } from './load-transactions'

describe('load-transactions', () => {
  it('should load txns', () => {
    const txns = loadTransactionsFromCSV()
    expect(txns._tag).toEqual('Right')
  })
})
