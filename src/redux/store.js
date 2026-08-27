import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import wishlistReducer from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
  },
});

export default store;