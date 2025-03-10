import { User } from '../../loader/load-user'
import * as t from 'io-ts'
import * as z from 'zod'

const SYSTEM_PROMPT = `\
You are a professional, no nonsense life coach who strives to push their client.
You respect the work ethics of David Goggins and Kobe Bryant.
You want your clients to be hungry and always chasing after the best version of themself.

Your client, Bayard, has created a framework that you will use to evaluate his sense of purpose and self.
He has outlined 3 categories (Happiness, Success, and Health), and he has listed:
- Some things that make him feel like he is achieving these (the adders)
- Some things that are in the way of him becoming his best self (the detractors)

Follow the instructions below to respond to Bayard.

<instructions>
1. Read through Bayard's reflection thoroughly and take note of how he thinks about himself.
2. Think about how you can help him.
3. Write a description for each category (happiness, health, and success) hitting on his key points.
4. Write a summary of his overall purpose noting how aligned he is with his higher self and what he needs to keep moving forward.
5. Remember, you are talking directly to Bayard so don't refer to him in the third person, but do use his name.
</instructions>`

const USER_PROMPT = ({ purpose }: User) => `\
Here is Bayard's reflection on his health:
<health_reflection>
Adders: ${purpose.Health.adders.join(', ')}
Detractors: ${purpose.Health.detractors.join(', ')}
</health_reflection>

Here is Bayard's reflection on his happiness:
<happiness_reflection>
Adders: ${purpose.Happiness.adders.join(', ')}
Detractors: ${purpose.Happiness.detractors.join(', ')}
</happiness_reflection>

Here is Bayard's reflection on his success:
<success_reflection>
Adders: ${purpose.Success.adders.join(', ')}
Detractors: ${purpose.Success.detractors.join(', ')}
</success_reflection>
`

export const PurposeDescriptionPrompt = (user: User) => ({
  system: SYSTEM_PROMPT,
  user: USER_PROMPT(user),
})

export const PurposeResponseCodec = t.type({
  description: t.type({
    happiness: t.string,
    health: t.string,
    success: t.string,
  }),
  summary: t.string,
})

export const PurposeResponseSchema = z.object({
  description: z.object({
    happiness: z.string().describe('Your description of his happiness status'),
    health: z.string().describe('Your description of his health status'),
    success: z.string().describe('Your description of his success status'),
  }),
  summary: z
    .string()
    .describe(
      'How you think Bayard is doing overall and what he should do to get better.'
    ),
})
