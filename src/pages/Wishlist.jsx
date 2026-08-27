import {
  useEffect,
} from "react";

import {
  Heart,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProducts,
} from "../redux/slices/productSlice";

import ProductCard from "../components/ProductCard";

import "./Wishlist.css";


function Wishlist() {

  const dispatch =
    useDispatch();


  // ========================================
  // WISHLIST
  // ========================================

  const wishlistItems =
    useSelector(
      (state) =>
        state.wishlist.items
    );


  // ========================================
  // ALL PRODUCTS
  // ========================================

  const productsFromStore =
    useSelector(
      (state) =>
        state.products.items
    );


  // ========================================
  // PRODUCT LOADING
  // ========================================

  const productsLoading =
    useSelector(
      (state) =>
        state.products.loading
    );


  // ========================================
  // LOAD PRODUCTS
  // ========================================

  useEffect(() => {

    if (
      productsFromStore.length === 0
    ) {

      dispatch(
        fetchProducts()
      );

    }

  }, [
    dispatch,
    productsFromStore.length,
  ]);


  // ========================================
  // CONVERT WISHLIST ITEMS
  // USING CURRENT PRODUCT DATA
  // ========================================

  const products =
    wishlistItems.map(
      (item) => {

        const currentProduct =
          productsFromStore.find(

            (product) =>
              Number(product.id) ===
              Number(item.productId)

          );


        // ====================================
        // RETURN PRODUCT
        // ====================================

        return {

          id:
            Number(
              item.productId
            ),

          title:
            currentProduct?.title ||
            item.title,

          price:
            Number(
              currentProduct?.price ??
              item.price ??
              0
            ),

          thumbnail:
            currentProduct?.thumbnail ||
            currentProduct?.images?.[0] ||
            item.thumbnail ||
            "",

          category:
            currentProduct?.category ||
            item.category ||
            "",

          rating:
            currentProduct?.rating ??
            item.rating ??
            0,

          // ==================================
          // IMPORTANT
          // USE CURRENT DATABASE STOCK
          // ==================================

          stock:
            Number(
              currentProduct?.stock ??
              0
            ),

          description:
            currentProduct?.description ||
            "",

          images:
            currentProduct?.images ||
            [],

        };

      }
    );


  // ========================================
  // LOADING PRODUCTS
  // ========================================

  if (
    productsLoading &&
    productsFromStore.length === 0
  ) {

    return (

      <section className="wishlist-page">

        <div className="container">

          <div className="wishlist-header">

            <span>
              YOUR FAVORITES
            </span>

            <h1>
              Wishlist
            </h1>

          </div>


          <div className="empty-wishlist">

            <p>
              Loading products...
            </p>

          </div>

        </div>

      </section>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <section className="wishlist-page">

      <div className="container">


        {/* ========================================
            HEADER
        ======================================== */}

        <div className="wishlist-header">

          <span>
            YOUR FAVORITES
          </span>

          <h1>
            Wishlist
          </h1>

        </div>


        {/* ========================================
            EMPTY WISHLIST
        ======================================== */}

        {products.length === 0 ? (

          <div className="empty-wishlist">

            <Heart
              size={65}
            />

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save products you love here.
            </p>

            <Link
              to="/products"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          /* ========================================
             WISHLIST PRODUCTS
          ======================================== */

          <div className="product-grid">

            {products.map(
              (product) => (

                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />

              )
            )}

          </div>

        )}

      </div>

    </section>

  );

}


export default Wishlist;