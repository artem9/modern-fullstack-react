import { querySchema, queryResolver } from './query.js'
import { postSchema, postResolver } from './post.js'
import { userSchema, userResolver } from './user.js'
import { mutationSchema, mutationResolver } from './mutations.js'

export const typeDefs = [querySchema, postSchema, userSchema, mutationSchema]
export const resolvers = [
  queryResolver,
  postResolver,
  userResolver,
  mutationResolver,
]
