import type {
  QueryResolvers,
  MutationResolvers,
  ModelRelationResolvers, CreateModelInput,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const models: QueryResolvers['models'] = () => {
  console.log(`${process.env.PROTOCOL}${process.env.VERCEL_URL || process.env.VERCEL_BRANCH_URL || process.env.APP_URL}`)
  return db.model.findMany()
}

export const model: QueryResolvers['model'] = ({ id }) => {
  return db.model.findUnique({
    where: { id },
  })
}


export const createModel: MutationResolvers['createModel'] = ({ input }) => {
  return db.model.create({
    data: input,
  })
}

export const updateModel: MutationResolvers['updateModel'] = ({
  id,
  input,
}) => {
  return db.model.update({
    data: input,
    where: { id },
  })
}

export const deleteModel: MutationResolvers['deleteModel'] = ({ id }) => {
  return db.model.delete({
    where: { id },
  })
}

export const Model: ModelRelationResolvers = {
  reviews: (_obj, { root }) => {
    return db.model.findUnique({ where: { id: root?.id } }).reviews()
  },
}


export const modelRepository = (function () {

  const findModelByName = async (name: string) => {
    return db.model.findUnique({
      where: {
        name: name
      },
    })
  }

  const createModel = async ({name}:CreateModelInput) => {
    return db.model.create({
      data: {
        name: name,
      },
    })
  }


  return {
    findModelByName,
    createModel
  }
})();
