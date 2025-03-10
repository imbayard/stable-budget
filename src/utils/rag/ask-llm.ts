import { pipe } from 'fp-ts/lib/function'
import * as z from 'zod'
import { CONFIG } from '../../config'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { zodResponseFormat } from 'openai/helpers/zod'

export const askLLM = <T>({
  zodSchema,
  parentKey,
  systemPrompt,
  userPrompt,
  codec,
}: {
  zodSchema: z.AnyZodObject
  parentKey: string
  systemPrompt: string
  userPrompt: string
  codec: t.Type<T>
}) =>
  pipe(
    TE.Do,
    TE.let('client', () => CONFIG.CHAT_CLIENT),
    TE.bindW('completion', ({ client }) =>
      pipe(
        TE.tryCatch(
          () =>
            client.beta.chat.completions.parse({
              model: 'gpt-4o-2024-08-06',
              messages: [
                { role: 'system', content: systemPrompt },
                {
                  role: 'user',
                  content: userPrompt,
                },
              ],
              response_format: zodResponseFormat(zodSchema, parentKey),
            }),
          (e) => {
            console.error(
              'An error occurred while asking OpenAI\n\n' +
                JSON.stringify(e, null, 2)
            )
            return new Error(JSON.stringify(e))
          }
        )
      )
    ),
    TE.map(({ completion }) => completion.choices[0].message.parsed),
    TE.chainW((response) =>
      pipe(
        response,
        codec.decode,
        TE.fromEither,
        TE.mapLeft((e) => {
          console.error(
            `Error decoding response\n\n${JSON.stringify(e, null, 2)}`
          )
          return new Error(
            `Error decoding response\n\n${JSON.stringify(e, null, 2)}`
          )
        })
      )
    )
  )
