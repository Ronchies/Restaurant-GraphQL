import { diningtableResolvers } from "./diningtableResolvers.js";
import { usersResolver } from "./usersResolvers.js";
import { loginResolver } from "./loginResolvers.js";
import { menuResolver } from "./menuResolvers.js";
import { orderResolver } from "./orderResolvers.js";
import { orderitemsResolver } from "./orderitemsResolvers.js";

export const resolvers = {
    Query: {
        ...usersResolver.Query,
        ...diningtableResolvers.Query,
        ...menuResolver.Query,
        ...orderResolver.Query,
        ...orderitemsResolver.Query
    },
    Mutation: {
        ...usersResolver.Mutation,
        ...diningtableResolvers.Mutation,
        ...loginResolver.Mutation,
        ...menuResolver.Mutation,
        ...orderResolver.Mutation,
        ...orderitemsResolver.Mutation
    },
};