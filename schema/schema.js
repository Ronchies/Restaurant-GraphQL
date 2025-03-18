import { mergeTypeDefs } from "@graphql-tools/merge"; 
import { userSchema } from "./userSchema.js";
import { rootSchema } from "./rootSchema.js";
import { diningtableSchema } from "./diningtableSchema.js";
import { loginSchema } from "./loginSchema.js";
import { menuSchema } from "./menuSchema.js";
import { orderSchema } from "./orderSchema.js";
import { orderitemsSchema } from "./orderitemsSchema.js";



export const typeDefs = mergeTypeDefs([
    rootSchema,
    userSchema,
    diningtableSchema,
    loginSchema,
    menuSchema,
    orderSchema,
    orderitemsSchema
]);