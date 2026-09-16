import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";


const API_URL =
  `${import.meta.env.VITE_API_URL}/api/wishlist`;

// ========================================
// GET TOKEN
// ========================================

const getToken = () => {

  return localStorage.getItem(
    "token"
  );

};


// ========================================
// NORMALIZE PRODUCT ID
// ========================================

const normalizeId = (id) => {

  return Number(id);

};


// ========================================
// COMMON RESPONSE HANDLER
// ========================================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // Response has no JSON body
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

// ========================================
// LOAD USER WISHLIST
// ========================================

export const loadUserWishlist =
  createAsyncThunk(

    "wishlist/loadUserWishlist",

    async (
      _,
      { rejectWithValue }
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
          await handleResponse(
            response
          );


        return data;

      } catch (error) {

        console.error(
          "Wishlist load error:",
          error
        );


        return rejectWithValue(
          error.message
        );

      }

    }

  );


// ========================================
// TOGGLE WISHLIST
// ========================================

export const toggleWishlist =
  createAsyncThunk(

    "wishlist/toggleWishlist",

    async (
      product,
      {
        getState,
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


        // ========================================
        // PRODUCT ID
        // ========================================

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


        // ========================================
        // CURRENT WISHLIST
        // ========================================

        const wishlistItems =
          getState()
            .wishlist
            .items;


        // ========================================
        // CHECK IF ALREADY EXISTS
        // ========================================

        const exists =
          wishlistItems.some(

            (item) =>
              normalizeId(
                item.productId
              ) ===
              productId

          );


        // ========================================
        // REMOVE FROM WISHLIST
        // ========================================

        if (exists) {

          const response =
            await fetch(

              `${API_URL}/${productId}`,

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
            await handleResponse(
              response
            );


          return data;

        }


        // ========================================
        // ADD TO WISHLIST
        // ========================================

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

                  // ====================================
                  // PRODUCT ID
                  // ====================================

                  id:
                    productId,


                  // ====================================
                  // PRODUCT INFORMATION
                  // ====================================

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


                  category:
                    product.category ||
                    "",


                  rating:

                    typeof product.rating ===
                    "object"

                      ? Number(
                          product.rating?.rate
                        ) || 0

                      : Number(
                          product.rating
                        ) || 0,


                  // ====================================
                  // CURRENT STOCK
                  // ====================================

                  stock:
                    Number(
                      product.stock || 0
                    ),

                }),

            }

          );


        const data =
          await handleResponse(
            response
          );


        return data;

      } catch (error) {

        console.error(
          "Wishlist error:",
          error
        );


        return rejectWithValue(
          error.message
        );

      }

    }

  );


// ========================================
// WISHLIST SLICE
// ========================================

const wishlistSlice =
  createSlice({

    name:
      "wishlist",


    initialState: {

      items: [],

      loading: false,

      error: null,

    },


    reducers: {


      // ========================================
      // CLEAR WISHLIST
      // ========================================

      clearWishlistFromState:
        (state) => {

          state.items = [];

          state.error = null;

        },

    },


    extraReducers:
      (builder) => {


        // ========================================
        // LOAD - PENDING
        // ========================================

        builder.addCase(

          loadUserWishlist.pending,

          (state) => {

            state.loading = true;

            state.error = null;

          }

        );


        // ========================================
        // LOAD - SUCCESS
        // ========================================

        builder.addCase(

          loadUserWishlist.fulfilled,

          (state, action) => {

            state.loading = false;


            state.items =
              Array.isArray(
                action.payload
              )

                ? action.payload

                : [];


            state.error = null;

          }

        );


        // ========================================
        // LOAD - ERROR
        // ========================================

        builder.addCase(

          loadUserWishlist.rejected,

          (state, action) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load wishlist";

          }

        );


        // ========================================
        // TOGGLE - PENDING
        // ========================================

        builder.addCase(

          toggleWishlist.pending,

          (state) => {

            state.error = null;

          }

        );


        // ========================================
        // TOGGLE - SUCCESS
        // ========================================

        builder.addCase(

          toggleWishlist.fulfilled,

          (state, action) => {

            state.items =
              Array.isArray(
                action.payload
              )

                ? action.payload

                : [];


            state.error = null;

          }

        );


        // ========================================
        // TOGGLE - ERROR
        // ========================================

        builder.addCase(

          toggleWishlist.rejected,

          (state, action) => {

            state.error =
              action.payload ||
              "Failed to update wishlist";

          }

        );

      },

  });


// ========================================
// EXPORT ACTION
// ========================================

export const {
  clearWishlistFromState,
} =
  wishlistSlice.actions;


// ========================================
// EXPORT REDUCER
// ========================================

export default wishlistSlice.reducer;