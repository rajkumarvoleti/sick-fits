/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';

/* eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

export default async function checkOut(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // Make sure they are signed in
  const userId = context.session.itemId;
  if(!userId){
    throw new Error('Sorry! You must be signed in to create an order!');
  }
  const user = await context.lists.User.findOne({
    where: {id:userId},
    resolveFields: graphql`
    id
    name
    email
    cart {
      id
      quantity
      product {
        name
        price
        description
        id
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
    `
  });
  // calculate the total price for their order
  const cartItems = user.cart.filter(cartItem => cartItem.product)
  const amount = cartItems.reduce(function(tally:number,cartItem:CartItemCreateInput){
    return tally + cartItem.quantity*cartItem.product.price;
  },0);
  // create the payment with stripe
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    // console.log(err);
    throw new Error(err.message);
  })
  // convert the cartItems to orderedItems
  const orderItems = user.cart.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: {connect: {id:cartItem.product.photo.id}},
    }
    return orderItem;  
  })
  // create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: {create: orderItems},
      user : {connect:{id:userId}}
    }
  })
  // clean up
  const cartItemIds = cartItems.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds 
  });
  return order;
}
