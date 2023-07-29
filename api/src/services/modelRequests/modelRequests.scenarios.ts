import type { Prisma, ModelRequest } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ModelRequestCreateArgs>({
  modelRequest: {
    one: { data: { userId: 'String', businessName: 'String' } },
    two: { data: { userId: 'String', businessName: 'String' } },
  },
})

export type StandardScenario = ScenarioData<ModelRequest, 'modelRequest'>
