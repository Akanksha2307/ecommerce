import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProducts,
} from "../redux/slices/productSlice";

import ProductCard from "../components/ProductCard";

import Loader from "../components/Loader";

import "./Products.css";


function Products() {

  const dispatch =
    useDispatch();


  // ========================================
  // PRODUCTS
  // ========================================

  const {
    items: products,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.products
  );


  // ========================================
  // FILTERS
  // ========================================

  const [search, setSearch] =
    useState("");


  const [category, setCategory] =
    useState("all");


  const [sort, setSort] =
    useState("default");


  // ========================================
  // ALWAYS FETCH LATEST PRODUCTS
  // ========================================

  useEffect(() => {

    dispatch(
      fetchProducts()
    );

  }, [dispatch]);


  // ========================================
  // GET CATEGORIES
  // ========================================

  const categories = [
    "all",
    ...new Set(
      products.map(
        (product) =>
          product.category
      )
    ),
  ];


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  let filteredProducts =
    products.filter(
      (product) => {

        const title =
          String(
            product.title || ""
          );


        const matchesSearch =
          title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );


        const matchesCategory =
          category === "all" ||
          product.category ===
            category;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );


  // ========================================
  // SORT LOW TO HIGH
  // ========================================

  if (
    sort === "low"
  ) {

    filteredProducts.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );

  }


  // ========================================
  // SORT HIGH TO LOW
  // ========================================

  if (
    sort === "high"
  ) {

    filteredProducts.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );

  }


  // ========================================
  // SORT RATING
  // ========================================

  if (
    sort === "rating"
  ) {

    filteredProducts.sort(
      (a, b) => {

        const ratingA =
          typeof a.rating ===
          "object"

            ? Number(
                a.rating?.rate || 0
              )

            : Number(
                a.rating || 0
              );


        const ratingB =
          typeof b.rating ===
          "object"

            ? Number(
                b.rating?.rate || 0
              )

            : Number(
                b.rating || 0
              );


        return (
          ratingB -
          ratingA
        );

      }
    );

  }


  return (

    <section className="products-page">

      <div className="container">


        {/* ========================================
            HEADER
        ======================================== */}

        <div className="products-header">

          <span>
            OUR COLLECTION
          </span>

          <h1>
            All Products
          </h1>

          <p>
            Find something you'll love.
          </p>

        </div>


        {/* ========================================
            FILTERS
        ======================================== */}

        <div className="filters">


          {/* SEARCH */}

          <div className="search-box">

            <Search
              size={20}
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={
                (e) =>
                  setSearch(
                    e.target.value
                  )
              }
            />

          </div>


          {/* CATEGORY */}

          <div className="filter-select">

            <SlidersHorizontal
              size={18}
            />

            <select
              value={category}
              onChange={
                (e) =>
                  setCategory(
                    e.target.value
                  )
              }
            >

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {
                      item ===
                      "all"

                        ? "All Categories"

                        : item
                    }

                  </option>

                )
              )}

            </select>

          </div>


          {/* SORT */}

          <select
            className="sort-select"
            value={sort}
            onChange={
              (e) =>
                setSort(
                  e.target.value
                )
            }
          >

            <option value="default">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

          </select>

        </div>


        {/* ========================================
            LOADING
        ======================================== */}

        {loading && (
          <Loader />
        )}


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* ========================================
            NO PRODUCTS
        ======================================== */}

        {!loading &&
          filteredProducts.length === 0 && (

            <div className="no-products">

              <h2>
                No products found
              </h2>

              <p>
                Try changing your
                search or filters.
              </p>

            </div>

          )}


        {/* ========================================
            PRODUCT GRID
        ======================================== */}

        <div className="product-grid">

          {filteredProducts.map(
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

      </div>

    </section>

  );

}


export default Products;