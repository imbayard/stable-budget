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

/**
 * Custom io-ts codec to default an empty string to undefined.
 */
export const DefaultToUndefinedIfEmptyString = new t.Type<
  string | undefined,
  string,
  unknown
>(
  'DefaultToUndefinedIfEmptyString',
  (u): u is string => typeof u === 'string' && u !== '',
  (u, c) =>
    pipe(
      t.string.validate(u, c), // Ensure it's a string
      E.chain((s) => {
        return s === ''
          ? t.success(undefined)
          : typeof s === 'string'
          ? t.success(s)
          : t.failure(u, c)
      })
    ),
  String // Encode number back to string
)
