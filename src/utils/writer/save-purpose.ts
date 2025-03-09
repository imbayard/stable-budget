import { pipe } from 'fp-ts/lib/function'
import { Purpose } from '../../types/types'
import * as E from 'fp-ts/Either'
import fs from 'fs'
import { CONFIG } from '../../config'

export const savePurpose = (purpose: any) =>
  pipe(
    purpose,
    Purpose.decode,
    E.mapLeft((e) => {
      console.error(`Error setting purpose`, { purpose, error: e })
      throw e
    }),
    E.map((p) => {
      const user = JSON.parse(
        fs.readFileSync(CONFIG.USER_CSV_FILENAME, 'utf-8')
      )
      user.purpose = {
        ...user.purpose,
        [p.purpose]: {
          adders: p.adders,
          detractors: p.detractors,
        },
      }
      fs.writeFileSync(CONFIG.USER_CSV_FILENAME, JSON.stringify(user, null, 2))
      return true
    })
  )
