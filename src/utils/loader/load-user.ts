import { pipe } from 'fp-ts/lib/function'
import fs from 'fs'
import { CONFIG } from '../../config'
import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import { Purpose } from '../../types/types'

export const loadUser = () =>
  pipe(
    fs.readFileSync(CONFIG.USER_CSV_FILENAME, 'utf-8'),
    JSON.parse,
    UserCodec.decode,
    E.getOrElseW((e) => {
      console.log('Error Loading User', JSON.stringify(e, null, 2))
      throw e
    })
  )

const UserCodec = t.type({
  priorities: t.array(t.string),
  priority_rankings: t.record(t.string, t.number),
  purpose: t.record(
    t.union([
      t.literal('Health'),
      t.literal('Success'),
      t.literal('Happiness'),
    ]),
    t.type({
      adders: t.array(t.string),
      detractors: t.array(t.string),
    })
  ),
})
