import type { Prisma, Review } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReviewCreateArgs>({
  review: {
    one: { data: { body: 'String', source: 'String' } },
    two: { data: { body: 'String', source: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Review, 'review'>
