import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkOut from './checkOut';
// make a fake fake graphql tagged template literal

const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      checkOut(token: String!): Order
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      checkOut,
    },
  },
});
