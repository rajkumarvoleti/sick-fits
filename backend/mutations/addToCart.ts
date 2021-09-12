/* eslint-disable */

import { KeystoneContext } from '@keystone-next/types';


import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART!!!');
  // query the current user to see if they are logged in
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // quer the current user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity'
  });
  const [exsistingCartItem] = allCartItems;
  // check if the item is already in the cart
  if (exsistingCartItem) {
    // if it is increment by one
    console.log(exsistingCartItem);
    console.log(
      `There are already ${exsistingCartItem.quantity}, increment by one`
    );
    // updating the cartItem
    return await context.lists.CartItem.updateOne({
      id: exsistingCartItem.id,
      data: { quantity: exsistingCartItem.quantity + 1 },
    });
  }
  // else create new one
  return await context.lists.CartItem.createOne({
    data: {
      product: {connect: {id:productId}},
      user: {connect: {id:session.itemId}}
    },
    resolveFields: false,
  })
}
