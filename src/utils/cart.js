export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product, quantity = 1, selectedSize = "M") => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => item.id === product.id && item.size === selectedSize
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      size: selectedSize,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
};