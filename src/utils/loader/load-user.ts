import { pipe } from 'fp-ts/lib/function'
import fs from 'fs'
import { CONFIG } from '../../config'
import * as t from 'io-ts'
import * as TE from 'fp-ts/TaskEither'
import { askLLM } from '../rag/ask-llm'
import {
  PurposeDescriptionPrompt,
  PurposeResponseCodec,
  PurposeResponseSchema,
} from '../rag/prompts/purposeDescriptionPrompt'

export const loadUser = () =>
  pipe(
    fs.readFileSync(CONFIG.USER_CSV_FILENAME, 'utf-8'),
    JSON.parse,
    UserCodec.decode,
    TE.fromEither,
    TE.chainW((user) =>
      pipe(
        user.purpose_description.summary !== ''
          ? TE.right(user)
          : getPurposeNotesFromLLM(user)
      )
    )
  )

const getPurposeNotesFromLLM = (user: User) =>
  pipe(
    askLLM({
      zodSchema: PurposeResponseSchema,
      codec: PurposeResponseCodec,
      userPrompt: PurposeDescriptionPrompt(user).user,
      systemPrompt: PurposeDescriptionPrompt(user).system,
      parentKey: 'purpose_review',
    }),
    TE.map((purpose_description) => ({ ...user, purpose_description })),
    TE.chainW((newUser) => {
      fs.writeFileSync(
        CONFIG.USER_CSV_FILENAME,
        JSON.stringify(newUser, null, 2)
      )
      return TE.right(newUser)
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
  purpose_description: t.type({
    description: t.record(
      t.union([
        t.literal('health'),
        t.literal('success'),
        t.literal('happiness'),
      ]),
      t.string
    ),
    summary: t.string,
  }),
})

export type User = t.TypeOf<typeof UserCodec>
