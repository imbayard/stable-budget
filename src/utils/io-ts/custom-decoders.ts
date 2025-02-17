import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

/**
 * Custom io-ts codec to decode a string into a number.
 */
export const NumberFromString = new t.Type<number, string, unknown>(
  'NumberFromString',
  (u): u is number => typeof u === 'number',
  (u, c) =>
    pipe(
      t.string.validate(u, c), // Ensure it's a string
      E.chain((s) => {
        const parsed = Number(s.replace(',', ''))
        return isNaN(parsed) ? t.failure(u, c) : t.success(parsed)
      })
    ),
  String // Encode number back to string
)
