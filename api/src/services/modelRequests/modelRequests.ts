import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const modelRequests: QueryResolvers['modelRequests'] = () => {
  return db.modelRequest.findMany()
}

export const modelRequest: QueryResolvers['modelRequest'] = ({ id }) => {
  return db.modelRequest.findUnique({
    where: { id },
  })
}

export const createModelRequest: MutationResolvers['createModelRequest'] = ({
  input,
}) => {
  return db.modelRequest.create({
    data: input,
  })
}

export const updateModelRequest: MutationResolvers['updateModelRequest'] = ({
  id,
  input,
}) => {
  return db.modelRequest.update({
    data: input,
    where: { id },
  })
}

export const deleteModelRequest: MutationResolvers['deleteModelRequest'] = ({
  id,
}) => {
  return db.modelRequest.delete({
    where: { id },
  })
}
