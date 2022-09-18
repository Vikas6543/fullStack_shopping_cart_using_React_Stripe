const initialState = {
  cart: [],
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // check if product already exists in cart
      const productExists = state.cart.some(
        (product) => product.id === action.payload.id
      );

      if (productExists) {
        // if product exists, increase quantity by 1
        return {
          ...state,
          cart: state.cart.map((product) =>
            product.id === action.payload.id
              ? { ...product, cartQty: product.cartQty + 1 }
              : product
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, cartQty: 1 }],
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.payload),
      };

    case 'ADD_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.id === action.payload
            ? { ...product, cartQty: product.cartQty + 1 }
            : product
        ),
      };

    case 'REMOVE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.id === action.payload && product.cartQty > 1
            ? { ...product, cartQty: product.cartQty - 1 }
            : product
        ),
      };

    default:
      return state;
  }
};
