import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";


// ========================================
// API URL
// ========================================

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/cart`;


// ========================================
// GET TOKEN
// ========================================

const getToken = () => {

  return localStorage.getItem(
    "token"
  );

};


// ========================================
// NORMALIZE ID
// ========================================

const normalizeId = (
  id
) => {

  return Number(id);

};


// ========================================
// LOAD CART
// ========================================

export const loadUserCart =
  createAsyncThunk(

    "cart/loadUserCart",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {

      try {

        const token =
          getToken();


        if (!token) {

          return [];

        }


        const response =
          await fetch(

            API_URL,

            {

              method:
                "GET",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(

            data.message ||
            "Failed to load cart"

          );

        }


        return data;

      } catch (error) {

        console.error(
          "Cart load error:",
          error
        );


        return rejectWithValue(

          error.message ||
          "Unable to connect to server"

        );

      }

    }

  );


// ========================================
// ADD TO CART
// ========================================

export const addToCart =
  createAsyncThunk(

    "cart/addToCart",

    async (

      product,

      {
        rejectWithValue,
      }

    ) => {

      try {

        const token =
          getToken();


        if (!token) {

          throw new Error(
            "Please login first"
          );

        }


        const productId =
          normalizeId(
            product.id
          );


        if (
          Number.isNaN(
            productId
          )
        ) {

          throw new Error(
            "Invalid product ID"
          );

        }


        // Frontend stock check

        const stock =
          Number(
            product.stock || 0
          );


        if (
          stock <= 0
        ) {

          throw new Error(
            `${product.title} is out of stock`
          );

        }


        const response =
          await fetch(

            API_URL,

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify({

                  id:
                    productId,

                  title:
                    product.title,

                  price:
                    Number(
                      product.price
                    ),

                  thumbnail:
                    product.thumbnail ||
                    product.images?.[0] ||
                    product.image ||
                    "",

                  quantity:
                    1,

                }),

            }

          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(

            data.message ||
            "Failed to add product"

          );

        }


        return data;

      } catch (error) {

        console.error(
          "Add to cart error:",
          error
        );


        return rejectWithValue(

          error.message ||
          "Unable to connect to server"

        );

      }

    }

  );


// ========================================
// INCREASE QUANTITY
// ========================================

export const increaseQuantity =
  createAsyncThunk(

    "cart/increaseQuantity",

    async (

      productId,

      {
        rejectWithValue,
      }

    ) => {

      try {

        const token =
          getToken();


        if (!token) {

          throw new Error(
            "Please login first"
          );

        }


        const id =
          normalizeId(
            productId
          );


        const response =
          await fetch(

            `${API_URL}/increase/${id}`,

            {

              method:
                "PUT",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(

            data.message ||
            "Failed to increase quantity"

          );

        }


        return data;

      } catch (error) {

        console.error(
          "Increase cart error:",
          error
        );


        return rejectWithValue(

          error.message ||
          "Unable to connect to server"

        );

      }

    }

  );


// ========================================
// DECREASE QUANTITY
// ========================================

export const decreaseQuantity =
  createAsyncThunk(

    "cart/decreaseQuantity",

    async (

      productId,

      {
        rejectWithValue,
      }

    ) => {

      try {

        const token =
          getToken();


        if (!token) {

          throw new Error(
            "Please login first"
          );

        }


        const id =
          normalizeId(
            productId
          );


        const response =
          await fetch(

            `${API_URL}/decrease/${id}`,

            {

              method:
                "PUT",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(

            data.message ||
            "Failed to decrease quantity"

          );

        }


        return data;

      } catch (error) {

        console.error(
          "Decrease cart error:",
          error
        );


        return rejectWithValue(

          error.message ||
          "Unable to connect to server"

        );

      }

    }

  );


// ========================================
// REMOVE FROM CART
// ========================================

export const removeFromCart =
  createAsyncThunk(

    "cart/removeFromCart",

    async (

      productId,

      {
        rejectWithValue,
      }

    ) => {

      try {

        const token =
          getToken();


        if (!token) {

          throw new Error(
            "Please login first"
          );

        }


        const id =
          normalizeId(
            productId
          );


        const response =
          await fetch(

            `${API_URL}/${id}`,

            {

              method:
                "DELETE",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(

            data.message ||
            "Failed to remove product"

          );

        }


        return data;

      } catch (error) {

        console.error(
          "Remove cart error:",
          error
        );


        return rejectWithValue(

          error.message ||
          "Unable to connect to server"

        );

      }

    }

  );


// ========================================
// CART SLICE
// ========================================

const cartSlice =
  createSlice({

    name:
      "cart",


    initialState: {

      items: [],

      loading: false,

      error: null,

    },


    reducers: {

      clearCart:
        (state) => {

          state.items = [];

          state.error = null;

        },

    },


    extraReducers:
      (builder) => {


        // ==================================
        // LOAD CART
        // ==================================

        builder.addCase(

          loadUserCart.pending,

          (state) => {

            state.loading =
              true;

            state.error =
              null;

          }

        );


        builder.addCase(

          loadUserCart.fulfilled,

          (state, action) => {

            state.loading =
              false;

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error =
              null;

          }

        );


        builder.addCase(

          loadUserCart.rejected,

          (state, action) => {

            state.loading =
              false;

            state.error =
              action.payload ||
              "Failed to load cart";

          }

        );


        // ==================================
        // ADD
        // ==================================

        builder.addCase(

          addToCart.fulfilled,

          (state, action) => {

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error =
              null;

          }

        );


        builder.addCase(

          addToCart.rejected,

          (state, action) => {

            state.error =
              action.payload ||
              "Failed to add product";

          }

        );


        // ==================================
        // INCREASE
        // ==================================

        builder.addCase(

          increaseQuantity.fulfilled,

          (state, action) => {

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error =
              null;

          }

        );


        builder.addCase(

          increaseQuantity.rejected,

          (state, action) => {

            state.error =
              action.payload ||
              "Failed to increase quantity";

          }

        );


        // ==================================
        // DECREASE
        // ==================================

        builder.addCase(

          decreaseQuantity.fulfilled,

          (state, action) => {

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error =
              null;

          }

        );


        builder.addCase(

          decreaseQuantity.rejected,

          (state, action) => {

            state.error =
              action.payload ||
              "Failed to decrease quantity";

          }

        );


        // ==================================
        // REMOVE
        // ==================================

        builder.addCase(

          removeFromCart.fulfilled,

          (state, action) => {

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error =
              null;

          }

        );


        builder.addCase(

          removeFromCart.rejected,

          (state, action) => {

            state.error =
              action.payload ||
              "Failed to remove product";

          }

        );

      },

  });


export const {
  clearCart,
} =
  cartSlice.actions;


export default cartSlice.reducer;