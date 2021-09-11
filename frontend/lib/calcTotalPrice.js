export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally;
    // product can be deleted but still in someone's cart
    return tally + cartItem.product.price * cartItem.quantity;
  }, 0);
}
