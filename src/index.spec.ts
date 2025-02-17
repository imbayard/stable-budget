import { main } from '.'

describe('index', () => {
  it('run', async () => {
    await main({
      start: '2025-02-01',
      end: '2025-02-28',
    })({})()
  })
})
