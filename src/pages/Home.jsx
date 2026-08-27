import { useEffect } from "react";

import {
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchProducts
} from "../redux/slices/productSlice";

import ProductCard from "../components/ProductCard";

import Loader from "../components/Loader";


function Home() {

  const dispatch = useDispatch();

  const {
    items: products,
    loading
  } = useSelector(
    (state) => state.products
  );


  useEffect(() => {

    if (products.length === 0) {

      dispatch(
        fetchProducts()
      );

    }

  }, [
    dispatch,
    products.length
  ]);


  const featuredProducts =
    products.slice(0, 4);


  return (

    <div>

      {/* HERO */}

      <section className="hero">

        <div className="container hero-content">

          <div>

            <span className="hero-tag">

              ✨ New collection available

            </span>


            <h1>

              Shop smarter.

              <br />

              Live better.

            </h1>


            <p>

              Discover products you'll love
              at prices you'll appreciate.

            </p>


            <Link
              to="/products"
              className="primary-button"
            >

              Shop Now

              <ArrowRight size={19} />

            </Link>

          </div>


          <div className="hero-shape">

            <ShoppingBag size={150} />

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features">

        <div className="container features-grid">


          <div className="feature">

            <Truck />

            <div>

              <h3>
                Fast Delivery
              </h3>

              <p>
                Quick and reliable delivery
              </p>

            </div>

          </div>


          <div className="feature">

            <ShieldCheck />

            <div>

              <h3>
                Secure Payment
              </h3>

              <p>
                Your payment is protected
              </p>

            </div>

          </div>


          <div className="feature">

            <ShoppingBag />

            <div>

              <h3>
                Quality Products
              </h3>

              <p>
                Products you'll love
              </p>

            </div>

          </div>


        </div>

      </section>


      {/* FEATURED PRODUCTS */}

      <section className="featured-section">

        <div className="container">


          <div className="section-heading">

            <div>

              <span>
                OUR PICKS
              </span>

              <h2>
                Featured Products
              </h2>

            </div>


            <Link to="/products">

              View All

              <ArrowRight size={17} />

            </Link>

          </div>


          {loading ? (

            <Loader />

          ) : (

            <div className="product-grid">

              {featuredProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>

  );
}


export default Home;