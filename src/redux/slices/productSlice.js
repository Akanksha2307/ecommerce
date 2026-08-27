import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";


// ========================================
// API URL
// ========================================

const API_URL =
  "http://localhost:5000/api/products";


// ========================================
// FETCH PRODUCTS
// ========================================

export const fetchProducts =
  createAsyncThunk(

    "products/fetchProducts",

    async (
      _,
      { rejectWithValue }
    ) => {

      try {

        const response =
          await fetch(
            API_URL,
            {
              method: "GET",

              cache: "no-store",

            }
          );


        if (!response.ok) {

          throw new Error(
            "Failed to fetch products"
          );

        }


        const data =
          await response.json();


        return data;

      } catch (error) {

        return rejectWithValue(
          error.message ||
          "Failed to fetch products"
        );

      }

    }

  );


// ========================================
// PRODUCT SLICE
// ========================================

const productSlice =
  createSlice({

    name: "products",

    initialState: {

      items: [],

      loading: false,

      error: null,

    },


    reducers: {

      // ==================================
      // CLEAR PRODUCTS
      // ==================================

      clearProducts:
        (state) => {

          state.items = [];

          state.error = null;

        },

    },


    extraReducers:
      (builder) => {


        // ==================================
        // FETCH PENDING
        // ==================================

        builder.addCase(

          fetchProducts.pending,

          (state) => {

            state.loading = true;

            state.error = null;

          }

        );


        // ==================================
        // FETCH SUCCESS
        // ==================================

        builder.addCase(

          fetchProducts.fulfilled,

          (
            state,
            action
          ) => {

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


        // ==================================
        // FETCH FAILED
        // ==================================

        builder.addCase(

          fetchProducts.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Unable to load products. Please try again.";

          }

        );

      },

  });


export const {
  clearProducts,
} =
  productSlice.actions;


export default productSlice.reducer;