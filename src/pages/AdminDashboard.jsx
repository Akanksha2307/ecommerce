import {
  useEffect,
  useState,
} from "react";

import {
  getAdminStats,
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,

  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,

  getAdminOrders,
  getAdminCarts,

  uploadProductImage,
} from "../services/adminService";

import "./Admin.css";


// ======================================================
// EMPTY PRODUCT
// ======================================================

const emptyProduct = {

  title: "",

  price: "",

  category: "",

  thumbnail: "",

  stock: "",

  rating: "",

};


// ======================================================
// EMPTY USER
// ======================================================

const emptyUser = {

  name: "",

  email: "",

  password: "",

};


// ======================================================
// FORMAT CURRENCY
// ======================================================

const money = (
  value
) => {

  return `$${Number(
    value || 0
  ).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    }
  )}`;

};


// ======================================================
// ADMIN PERMISSIONS
// ======================================================

const getAdminPermissions = () => {
  try {
    const stored =
      localStorage.getItem("adminPermissions");

    if (stored) {
      return JSON.parse(stored);
    }

    // Fallback: read permissions directly from JWT
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      return {};
    }

    const payload =
      JSON.parse(
        atob(
          token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

    return payload.permissions || {};
  } catch (error) {
    console.error(
      "Failed to read admin permissions:",
      error
    );

    return {};
  }
};


// ======================================================
// ADMIN DASHBOARD
// ======================================================

const AdminDashboard =
  () => {

    // ==================================================
    // ADMIN PERMISSIONS
    // ==================================================

    const permissions =
      getAdminPermissions();


    const canAccess =
      (permission) =>
        permissions[permission] === true;


    // ==================================================
    // ACTIVE TAB
    // ==================================================

    const [
      activeTab,
      setActiveTab,
    ] = useState(
      "dashboard"
    );


    // ==================================================
    // STATS
    // ==================================================

    const [
      stats,
      setStats,
    ] = useState({

      products: 0,

      users: 0,

      orders: 0,

      revenue: 0,

      averageOrderValue: 0,

      inventoryValue: 0,

      activeCarts: 0,

      activeCartItems: 0,

      lowStockCount: 0,

      ordersByStatus: {},

      lowStockProducts: [],

      highStockProducts: [],

    });


    // ==================================================
    // DATA
    // ==================================================

    const [
      products,
      setProducts,
    ] = useState([]);


    const [
      users,
      setUsers,
    ] = useState([]);


    const [
      orders,
      setOrders,
    ] = useState([]);


    const [
      carts,
      setCarts,
    ] = useState([]);


    // ==================================================
    // PRODUCT FORM
    // ==================================================

    const [
      productForm,
      setProductForm,
    ] = useState(
      emptyProduct
    );


    // ==================================================
    // PRODUCT IMAGE
    // ==================================================

    const [
      productImage,
      setProductImage,
    ] = useState(null);


    const [
      imagePreview,
      setImagePreview,
    ] = useState("");


    const [
      imageUploading,
      setImageUploading,
    ] = useState(false);


    // ==================================================
    // USER FORM
    // ==================================================

    const [
      userForm,
      setUserForm,
    ] = useState(
      emptyUser
    );


    // ==================================================
    // EDITING PRODUCT
    // ==================================================

    const [
      editingProduct,
      setEditingProduct,
    ] = useState(null);


    // ==================================================
    // EDITING USER
    // ==================================================

    const [
      editingUser,
      setEditingUser,
    ] = useState(null);


    // ==================================================
    // PRODUCT SEARCH
    // ==================================================

    const [
      productSearch,
      setProductSearch,
    ] = useState("");


    // ==================================================
    // USER SEARCH
    // ==================================================

    const [
      userSearch,
      setUserSearch,
    ] = useState("");


    // ==================================================
    // LOADING
    // ==================================================

    const [
      loading,
      setLoading,
    ] = useState(true);


    // ==================================================
    // LOAD EVERYTHING
    // ==================================================

    useEffect(() => {

      loadDashboard();

    }, []);


    // ==================================================
    // LOAD DASHBOARD
    // ==================================================

    const loadDashboard =
      async () => {

        setLoading(true);


        try {

          // ==========================================
          // STATS
          // ==========================================

          const statsData =
            await getAdminStats();


          setStats({

            products:
              Number(
                statsData?.products || 0
              ),

            users:
              Number(
                statsData?.users || 0
              ),

            orders:
              Number(
                statsData?.orders || 0
              ),

            revenue:
              Number(
                statsData?.revenue || 0
              ),

            averageOrderValue:
              Number(
                statsData?.averageOrderValue || 0
              ),

            inventoryValue:
              Number(
                statsData?.inventoryValue || 0
              ),

            activeCarts:
              Number(
                statsData?.activeCarts || 0
              ),

            activeCartItems:
              Number(
                statsData?.activeCartItems || 0
              ),

            lowStockCount:
              Number(
                statsData?.lowStockCount || 0
              ),

            ordersByStatus:
              statsData?.ordersByStatus ||
              {},

            lowStockProducts:
              Array.isArray(
                statsData?.lowStockProducts
              )
                ? statsData.lowStockProducts
                : [],

            highStockProducts:
              Array.isArray(
                statsData?.highStockProducts
              )
                ? statsData.highStockProducts
                : [],

          });


          // ==========================================
          // PRODUCTS
          // ONLY LOAD IF PERMISSION IS GRANTED
          // ==========================================

          if (canAccess("products")) {

            const productsData =
              await getAdminProducts();


            setProducts(

              Array.isArray(
                productsData
              )
                ? productsData
                : []

            );

          } else {

            setProducts([]);

          }


          // ==========================================
          // USERS
          // ONLY LOAD IF PERMISSION IS GRANTED
          // ==========================================

          if (canAccess("users")) {

            const usersData =
              await getAdminUsers();


            setUsers(

              Array.isArray(
                usersData
              )
                ? usersData
                : []

            );

          } else {

            setUsers([]);

          }


          // ==========================================
          // ORDERS
          // ONLY LOAD IF PERMISSION IS GRANTED
          // ==========================================

          if (canAccess("orders")) {

            const ordersData =
              await getAdminOrders();


            setOrders(

              Array.isArray(
                ordersData
              )
                ? ordersData
                : []

            );

          } else {

            setOrders([]);

          }


          // ==========================================
          // CARTS
          // ONLY LOAD IF PERMISSION IS GRANTED
          // ==========================================

          if (canAccess("carts")) {

            const cartsData =
              await getAdminCarts();


            setCarts(

              Array.isArray(
                cartsData
              )
                ? cartsData
                : []

            );

          } else {

            setCarts([]);

          }

        } catch (
          error
        ) {

          console.error(
            "Dashboard loading error:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


    // ==================================================
    // PRODUCT INPUT
    // ==================================================

    const handleProductChange =
      (e) => {

        const {
          name,
          value,
        } = e.target;


        setProductForm(
          (previous) => ({

            ...previous,

            [name]:
              value,

          })
        );

      };


    // ==================================================
    // PRODUCT IMAGE
    // ==================================================

    const handleProductImageChange =
      async (e) => {

        const file =
          e.target.files?.[0];


        if (!file) {

          return;

        }


        // ==========================================
        // IMAGE TYPE
        // ==========================================

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          alert(
            "Please select an image file."
          );


          e.target.value =
            "";


          return;

        }


        // ==========================================
        // IMAGE SIZE
        // ==========================================

        if (
          file.size >
          5 * 1024 * 1024
        ) {

          alert(
            "Image must be smaller than 5 MB."
          );


          e.target.value =
            "";


          return;

        }


        try {

          setProductImage(
            file
          );


          setImageUploading(
            true
          );


          // ========================================
          // LOCAL PREVIEW
          // ========================================

          const localUrl =
            URL.createObjectURL(
              file
            );


          setImagePreview(
            localUrl
          );


          // ========================================
          // UPLOAD TO CLOUDINARY
          // ========================================

          const data =
            await uploadProductImage(
              file
            );


          if (
            !data?.url
          ) {

            throw new Error(
              "Cloudinary did not return an image URL"
            );

          }


          // ========================================
          // SAVE CLOUDINARY URL
          // ========================================

          setProductForm(
            (previous) => ({

              ...previous,

              thumbnail:
                data.url,

            })
          );


          // ========================================
          // CLOUDINARY PREVIEW
          // ========================================

          setImagePreview(
            data.url
          );

        } catch (
          error
        ) {

          console.error(
            "Image upload error:",
            error
          );


          setProductImage(
            null
          );


          setImagePreview(
            ""
          );


          setProductForm(
            (previous) => ({

              ...previous,

              thumbnail:
                "",

            })
          );


          alert(
            error.message ||
            "Failed to upload image"
          );

        } finally {

          setImageUploading(
            false
          );

        }

      };


    // ==================================================
    // SAVE PRODUCT
    // ==================================================

    const submitProduct =
      async (e) => {

        e.preventDefault();


        if (
          imageUploading
        ) {

          alert(
            "Please wait for the image upload to finish."
          );


          return;

        }


        try {

          const productData = {

            ...productForm,

            price:
              Number(
                productForm.price
              ),

            stock:
              Number(
                productForm.stock || 0
              ),

            rating:
              Number(
                productForm.rating || 0
              ),

          };


          // ========================================
          // ADD
          // ========================================

          if (
            !editingProduct
          ) {

            await addAdminProduct(
              productData
            );


            alert(
              "Product added successfully"
            );

          }


          // ========================================
          // UPDATE
          // ========================================

          else {

            await updateAdminProduct(

              editingProduct._id,

              productData

            );


            alert(
              "Product updated successfully"
            );

          }


          // ========================================
          // RESET
          // ========================================

          setProductForm(
            emptyProduct
          );


          setProductImage(
            null
          );


          setImagePreview(
            ""
          );


          setEditingProduct(
            null
          );


          await loadDashboard();

        } catch (
          error
        ) {

          console.error(
            "Product save error:",
            error
          );


          alert(
            error.message ||
            "Failed to save product"
          );

        }

      };


    // ==================================================
    // EDIT PRODUCT
    // ==================================================

    const editProduct =
      (product) => {

        setEditingProduct(
          product
        );


        setProductForm({

          title:
            product.title ||
            "",

          price:
            product.price ??
            "",

          category:
            product.category ||
            "",

          thumbnail:
            product.thumbnail ||
            "",

          stock:
            product.stock ??
            "",

          rating:
            product.rating ??
            "",

        });


        setProductImage(
          null
        );


        setImagePreview(
          product.thumbnail ||
          ""
        );


        setActiveTab(
          "products"
        );


        window.scrollTo({

          top: 0,

          behavior:
            "smooth",

        });

      };


    // ==================================================
    // DELETE PRODUCT
    // ==================================================

    const removeProduct =
      async (
        id
      ) => {

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this product?"
          );


        if (!confirmed) {

          return;

        }


        try {

          await deleteAdminProduct(
            id
          );


          alert(
            "Product deleted successfully"
          );


          await loadDashboard();

        } catch (
          error
        ) {

          alert(
            error.message
          );

        }

      };


    // ==================================================
    // USER INPUT
    // ==================================================

    const handleUserChange =
      (e) => {

        const {
          name,
          value,
        } = e.target;


        setUserForm(
          (previous) => ({

            ...previous,

            [name]:
              value,

          })
        );

      };


    // ==================================================
    // SAVE USER
    // ==================================================

    const submitUser =
      async (e) => {

        e.preventDefault();


        try {

          // ========================================
          // UPDATE USER
          // ========================================

          if (
            editingUser
          ) {

            const data = {

              name:
                userForm.name,

              email:
                userForm.email,

            };


            if (
              userForm.password
            ) {

              data.password =
                userForm.password;

            }


            await updateAdminUser(

              editingUser._id,

              data

            );


            alert(
              "User updated successfully"
            );

          }


          // ========================================
          // ADD USER
          // ========================================

          else {

            await addAdminUser(
              userForm
            );


            alert(
              "User added successfully"
            );

          }


          setUserForm(
            emptyUser
          );


          setEditingUser(
            null
          );


          await loadDashboard();

        } catch (
          error
        ) {

          alert(
            error.message
          );

        }

      };


    // ==================================================
    // EDIT USER
    // ==================================================

    const editUser =
      (user) => {

        setEditingUser(
          user
        );


        setUserForm({

          name:
            user.name ||
            "",

          email:
            user.email ||
            "",

          password:
            "",

        });


        setActiveTab(
          "users"
        );


        window.scrollTo({

          top: 0,

          behavior:
            "smooth",

        });

      };


    // ==================================================
    // DELETE USER
    // ==================================================

    const removeUser =
      async (
        id
      ) => {

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this user?"
          );


        if (!confirmed) {

          return;

        }


        try {

          await deleteAdminUser(
            id
          );


          alert(
            "User deleted successfully"
          );


          await loadDashboard();

        } catch (
          error
        ) {

          alert(
            error.message
          );

        }

      };


    // ==================================================
    // FILTER PRODUCTS
    // ==================================================

    const filteredProducts =
      products.filter(
        (product) => {

          const text =
            `${product.title || ""} ${
              product.category || ""
            }`.toLowerCase();


          return text.includes(
            productSearch.toLowerCase()
          );

        }
      );


    // ==================================================
    // FILTER USERS
    // ==================================================

    const filteredUsers =
      users.filter(
        (user) => {

          const text =
            `${user.name || ""} ${
              user.email || ""
            }`.toLowerCase();


          return text.includes(
            userSearch.toLowerCase()
          );

        }
      );


    // ==================================================
    // LOGOUT
    // ==================================================

    const logout =
      () => {

        localStorage.removeItem(
          "adminToken"
        );


        localStorage.removeItem(
          "adminEmail"
        );


        localStorage.removeItem(
          "adminPermissions"
        );


        window.location.href =
          "/admin/login";

      };


    // ==================================================
    // PAGE TITLE
    // ==================================================

    const pageTitle =
      activeTab ===
      "dashboard"

        ? "Admin Dashboard"

        : activeTab ===
          "products"

        ? "Products"

        : activeTab ===
          "users"

        ? "Users"

        : activeTab ===
          "carts"

        ? "Carts"

        : "Orders";


    // ==================================================
    // RENDER
    // ==================================================

    return (

      <div className="admin-layout">


        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="admin-sidebar">

          <div className="admin-brand">
            GreenCart
          </div>


          <div className="admin-sidebar-title">
            ADMIN PANEL
          </div>


          <button
            className={
              activeTab ===
              "dashboard"

                ? "admin-nav active"

                : "admin-nav"
            }
            onClick={() =>
              setActiveTab(
                "dashboard"
              )
            }
          >
            Dashboard
          </button>


          {canAccess("products") && (

            <button
              className={
                activeTab ===
                "products"

                  ? "admin-nav active"

                  : "admin-nav"
              }
              onClick={() =>
                setActiveTab(
                  "products"
                )
              }
            >
              Products
            </button>

          )}


          {canAccess("users") && (

            <button
              className={
                activeTab ===
                "users"

                  ? "admin-nav active"

                  : "admin-nav"
              }
              onClick={() =>
                setActiveTab(
                  "users"
                )
              }
            >
              Users
            </button>

          )}


          {canAccess("carts") && (

            <button
              className={
                activeTab ===
                "carts"

                  ? "admin-nav active"

                  : "admin-nav"
              }
              onClick={() =>
                setActiveTab(
                  "carts"
                )
              }
            >
              Carts
            </button>

          )}


          {canAccess("orders") && (

            <button
              className={
                activeTab ===
                "orders"

                  ? "admin-nav active"

                  : "admin-nav"
              }
              onClick={() =>
                setActiveTab(
                  "orders"
                )
              }
            >
              Orders
            </button>

          )}


          <button
            className="admin-nav logout"
            onClick={
              logout
            }
          >
            Logout
          </button>

        </aside>


        {/* ==================================================
            MAIN
        ================================================== */}

        <main className="admin-main">


          <header className="admin-header">

            <div>

              <h1>
                {pageTitle}
              </h1>

              <p>
                Manage your GreenCart store
              </p>

            </div>


            <div className="admin-account">
              Admin
            </div>

          </header>


          {loading ? (

            <div className="admin-loading">
              Loading dashboard...
            </div>

          ) : (

            <>


              {/* ==================================================
                  DASHBOARD
              ================================================== */}

              {activeTab ===
                "dashboard" && (

                <section>


                  <div className="admin-stat-grid">


                    {/* REVENUE */}

                    <div className="admin-stat-card revenue-card">

                      <span>
                        TOTAL REVENUE
                      </span>

                      <strong>
                        {money(
                          stats.revenue
                        )}
                      </strong>

                      <small>
                        from{" "}
                        {stats.orders}{" "}
                        orders
                      </small>

                    </div>


                    {/* AVERAGE ORDER */}

                    <div className="admin-stat-card">

                      <span>
                        AVG. ORDER VALUE
                      </span>

                      <strong>
                        {money(
                          stats.averageOrderValue
                        )}
                      </strong>

                    </div>


                    {/* ORDERS */}

                    <div className="admin-stat-card">

                      <span>
                        TOTAL ORDERS
                      </span>

                      <strong>
                        {stats.orders}
                      </strong>

                    </div>


                    {/* USERS */}

                    <div className="admin-stat-card">

                      <span>
                        TOTAL USERS
                      </span>

                      <strong>
                        {stats.users}
                      </strong>

                    </div>


                    {/* PRODUCTS */}

                    <div className="admin-stat-card">

                      <span>
                        TOTAL PRODUCTS
                      </span>

                      <strong>
                        {stats.products}
                      </strong>

                      <small>

                        {
                          products.filter(
                            (product) =>
                              Number(
                                product.stock ||
                                0
                              ) === 0
                          ).length
                        }{" "}

                        out of stock

                      </small>

                    </div>


                    {/* INVENTORY */}

                    <div className="admin-stat-card">

                      <span>
                        INVENTORY VALUE
                      </span>

                      <strong>
                        {money(
                          stats.inventoryValue
                        )}
                      </strong>

                      <small>
                        price × stock
                      </small>

                    </div>


                    {/* CARTS */}

                    <div className="admin-stat-card">

                      <span>
                        ACTIVE CARTS
                      </span>

                      <strong>
                        {stats.activeCarts}
                      </strong>

                      <small>
                        {
                          stats.activeCartItems
                        }{" "}
                        items total
                      </small>

                    </div>


                    {/* LOW STOCK */}

                    <div className="admin-stat-card">

                      <span>
                        LOW STOCK ITEMS
                      </span>

                      <strong>
                        {stats.lowStockCount}
                      </strong>

                      <small>
                        stock ≤ 10
                      </small>

                    </div>

                  </div>


                  {/* ==================================================
                      ORDERS + LOW STOCK
                  ================================================== */}

                  <div className="admin-overview-two-column">


                    {/* ORDERS BY STATUS */}

                    <div className="admin-panel-card">

                      <h2>
                        Orders by Status
                      </h2>


                      {Object.keys(
                        stats.ordersByStatus
                      ).length === 0 ? (

                        <p className="admin-muted">
                          No orders yet.
                        </p>

                      ) : (

                        Object.entries(
                          stats.ordersByStatus
                        ).map(
                          (
                            [
                              status,
                              count,
                            ]
                          ) => (

                            <div
                              className="status-row"
                              key={
                                status
                              }
                            >

                              <span>
                                {count}{" "}
                                {status}
                              </span>

                              <strong>
                                {count}
                              </strong>

                            </div>

                          )
                        )

                      )}

                    </div>


                    {/* LOW STOCK */}

                    <div className="admin-panel-card">

                      <h2>
                        Low Stock (≤ 10)
                      </h2>


                      {stats.lowStockProducts.length ===
                      0 ? (

                        <p className="admin-muted">
                          Nothing running low right now.
                        </p>

                      ) : (

                        stats.lowStockProducts.map(
                          (
                            product
                          ) => (

                            <div
                              className="stock-row"
                              key={
                                product._id
                              }
                            >

                              <div className="stock-product">

                                {product.thumbnail && (

                                  <img
                                    src={
                                      product.thumbnail
                                    }
                                    alt={
                                      product.title
                                    }
                                  />

                                )}

                                <span>
                                  {
                                    product.title
                                  }
                                </span>

                              </div>


                              <strong className="low-stock-text">

                                {
                                  product.stock
                                }{" "}
                                left

                              </strong>

                            </div>

                          )
                        )

                      )}

                    </div>

                  </div>


                  {/* ==================================================
                      HIGH STOCK
                  ================================================== */}

                  <div className="admin-panel-card">

                    <h2>
                      High Stock
                    </h2>


                    {stats.highStockProducts.length ===
                    0 ? (

                      <p className="admin-muted">
                        No high-stock products.
                      </p>

                    ) : (

                      stats.highStockProducts
                        .slice(
                          0,
                          10
                        )
                        .map(
                          (
                            product
                          ) => (

                            <div
                              className="stock-row"
                              key={
                                product._id
                              }
                            >

                              <div className="stock-product">

                                {product.thumbnail && (

                                  <img
                                    src={
                                      product.thumbnail
                                    }
                                    alt={
                                      product.title
                                    }
                                  />

                                )}

                                <span>
                                  {
                                    product.title
                                  }
                                </span>

                              </div>


                              <strong className="high-stock-text">

                                {
                                  product.stock
                                }{" "}
                                in stock

                              </strong>

                            </div>

                          )
                        )

                    )}

                  </div>

                </section>

              )}


              {/* ==================================================
                  PRODUCTS
              ================================================== */}

              {activeTab ===
                "products" &&
                canAccess("products") && (

                <section>


                  {/* ==================================================
                      ADD / EDIT PRODUCT
                  ================================================== */}

                  <div className="admin-form-card">

                    <h2>

                      {editingProduct

                        ? "Edit Product"

                        : "Add Product"}

                    </h2>


                    <form
                      className="admin-form"
                      onSubmit={
                        submitProduct
                      }
                      style={{
                        alignItems:
                          "start",
                      }}
                    >


                      {/* PRODUCT TITLE */}

                      <input
                        name="title"
                        placeholder="Product title"
                        value={
                          productForm.title
                        }
                        onChange={
                          handleProductChange
                        }
                        required
                      />


                      {/* CATEGORY */}

                      <input
                        name="category"
                        placeholder="Category"
                        value={
                          productForm.category
                        }
                        onChange={
                          handleProductChange
                        }
                        required
                      />


                      {/* PRICE */}

                      <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={
                          productForm.price
                        }
                        onChange={
                          handleProductChange
                        }
                        required
                      />


                      {/* STOCK */}

                      <input
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={
                          productForm.stock
                        }
                        onChange={
                          handleProductChange
                        }
                      />


                      {/* ==================================================
                          PRODUCT IMAGE
                      ================================================== */}

                      <div
                        className="admin-image-upload"
                        style={{
                          alignSelf:
                            "start",
                        }}
                      >

                        <label className="admin-image-label">

                          Product Image

                        </label>


                        {/* SMALL PREVIEW */}

                        {(imagePreview ||
                          productForm.thumbnail) && (

                          <div
                            className="admin-image-preview"
                            style={{
                              width:
                                "120px",

                              height:
                                "120px",

                              minWidth:
                                "120px",

                              minHeight:
                                "120px",

                              maxWidth:
                                "120px",

                              maxHeight:
                                "120px",

                              overflow:
                                "hidden",

                              borderRadius:
                                "10px",
                            }}
                          >

                            <img
                              src={
                                imagePreview ||
                                productForm.thumbnail
                              }
                              alt="Product preview"
                              style={{
                                width:
                                  "100%",

                                height:
                                  "100%",

                                objectFit:
                                  "contain",

                                display:
                                  "block",
                              }}
                            />

                          </div>

                        )}


                        {/* FILE INPUT */}

                        <input
                          className="admin-file-input"
                          type="file"
                          accept="image/*"
                          onChange={
                            handleProductImageChange
                          }
                          disabled={
                            imageUploading
                          }
                        />


                        {/* UPLOADING */}

                        {imageUploading && (

                          <p className="admin-image-uploading">

                            Uploading image to
                            Cloudinary...

                          </p>

                        )}


                        {/* CLOUDINARY URL */}

                        <input
                          className="admin-thumbnail-input"
                          name="thumbnail"
                          type="url"
                          placeholder="Cloudinary image URL"
                          value={
                            productForm.thumbnail
                          }
                          onChange={
                            handleProductChange
                          }
                        />

                      </div>


                      {/* RATING */}

                      <input
                        name="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="Rating"
                        value={
                          productForm.rating
                        }
                        onChange={
                          handleProductChange
                        }
                      />


                      {/* BUTTONS */}

                      <div className="admin-form-actions">

                        <button
                          type="submit"
                          className="admin-primary-btn"
                          disabled={
                            imageUploading
                          }
                        >

                          {imageUploading

                            ? "Uploading Image..."

                            : editingProduct

                            ? "Update Product"

                            : "Add Product"}

                        </button>


                        {editingProduct && (

                          <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={() => {

                              setEditingProduct(
                                null
                              );

                              setProductForm(
                                emptyProduct
                              );

                              setProductImage(
                                null
                              );

                              setImagePreview(
                                ""
                              );

                            }}
                          >

                            Cancel

                          </button>

                        )}

                      </div>

                    </form>

                  </div>


                  {/* ==================================================
                      PRODUCT LIST
                  ================================================== */}

                  <div className="admin-table-card">

                    <div className="admin-table-header">

                      <h2>
                        All Products
                      </h2>


                      <input
                        className="admin-search"
                        placeholder="Search products..."
                        value={
                          productSearch
                        }
                        onChange={
                          (e) =>
                            setProductSearch(
                              e.target.value
                            )
                        }
                      />

                    </div>


                    <div className="admin-table-wrapper">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              Product
                            </th>

                            <th>
                              Category
                            </th>

                            <th>
                              Price
                            </th>

                            <th>
                              Stock
                            </th>

                            <th>
                              Actions
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {filteredProducts.length ===
                          0 ? (

                            <tr>

                              <td
                                colSpan="5"
                                className="empty-table"
                              >
                                No products found.
                              </td>

                            </tr>

                          ) : (

                            filteredProducts.map(
                              (
                                product
                              ) => (

                                <tr
                                  key={
                                    product._id
                                  }
                                >

                                  <td>

                                    <div className="admin-product">

                                      {product.thumbnail && (

                                        <img
                                          src={
                                            product.thumbnail
                                          }
                                          alt={
                                            product.title
                                          }
                                        />

                                      )}

                                      <div>

                                        <strong>
                                          {
                                            product.title
                                          }
                                        </strong>

                                        <small>

                                          ID:{" "}

                                          {
                                            product.id
                                          }

                                        </small>

                                      </div>

                                    </div>

                                  </td>


                                  <td>
                                    {
                                      product.category
                                    }
                                  </td>


                                  <td>
                                    {money(
                                      product.price
                                    )}
                                  </td>


                                  <td>

                                    <span
                                      className={
                                        Number(
                                          product.stock ||
                                          0
                                        ) <= 10

                                          ? "stock-badge low"

                                          : "stock-badge"
                                      }
                                    >

                                      {
                                        product.stock
                                      }

                                    </span>

                                  </td>


                                  <td>

                                    <button
                                      className="edit-btn"
                                      onClick={() =>
                                        editProduct(
                                          product
                                        )
                                      }
                                    >
                                      Edit
                                    </button>


                                    <button
                                      className="delete-btn"
                                      onClick={() =>
                                        removeProduct(
                                          product._id
                                        )
                                      }
                                    >
                                      Delete
                                    </button>

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </section>

              )}


              {/* ==================================================
                  USERS
              ================================================== */}

              {activeTab ===
                "users" &&
                canAccess("users") && (

                <section>


                  <div className="admin-form-card">

                    <h2>

                      {editingUser

                        ? "Edit User"

                        : "Add User"}

                    </h2>


                    <form
                      className="admin-form"
                      onSubmit={
                        submitUser
                      }
                    >

                      <input
                        name="name"
                        placeholder="Name"
                        value={
                          userForm.name
                        }
                        onChange={
                          handleUserChange
                        }
                        required
                      />


                      <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={
                          userForm.email
                        }
                        onChange={
                          handleUserChange
                        }
                        required
                      />


                      <input
                        name="password"
                        type="password"
                        placeholder={
                          editingUser
                            ? "New password (optional)"
                            : "Password"
                        }
                        value={
                          userForm.password
                        }
                        onChange={
                          handleUserChange
                        }
                        required={
                          !editingUser
                        }
                      />


                      <div className="admin-form-actions">

                        <button
                          type="submit"
                          className="admin-primary-btn"
                        >

                          {editingUser

                            ? "Update User"

                            : "Add User"}

                        </button>


                        {editingUser && (

                          <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={() => {

                              setEditingUser(
                                null
                              );

                              setUserForm(
                                emptyUser
                              );

                            }}
                          >

                            Cancel

                          </button>

                        )}

                      </div>

                    </form>

                  </div>


                  {/* USERS TABLE */}

                  <div className="admin-table-card">

                    <div className="admin-table-header">

                      <h2>
                        All Users
                      </h2>


                      <input
                        className="admin-search"
                        placeholder="Search users..."
                        value={
                          userSearch
                        }
                        onChange={
                          (e) =>
                            setUserSearch(
                              e.target.value
                            )
                        }
                      />

                    </div>


                    <div className="admin-table-wrapper">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              Name
                            </th>

                            <th>
                              Email
                            </th>

                            <th>
                              Role
                            </th>

                            <th>
                              Joined
                            </th>

                            <th>
                              Actions
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {filteredUsers.length ===
                          0 ? (

                            <tr>

                              <td
                                colSpan="5"
                                className="empty-table"
                              >
                                No users found.
                              </td>

                            </tr>

                          ) : (

                            filteredUsers.map(
                              (
                                user
                              ) => (

                                <tr
                                  key={
                                    user._id
                                  }
                                >

                                  <td>
                                    {
                                      user.name
                                    }
                                  </td>

                                  <td>
                                    {
                                      user.email
                                    }
                                  </td>

                                  <td>

                                    <span className="role-badge">

                                      {
                                        user.role ||
                                        "user"
                                      }

                                    </span>

                                  </td>

                                  <td>

                                    {user.createdAt

                                      ? new Date(
                                          user.createdAt
                                        ).toLocaleDateString(
                                          "en-IN"
                                        )

                                      : "-"}

                                  </td>

                                  <td>

                                    <button
                                      className="edit-btn"
                                      onClick={() =>
                                        editUser(
                                          user
                                        )
                                      }
                                    >
                                      Edit
                                    </button>


                                    <button
                                      className="delete-btn"
                                      onClick={() =>
                                        removeUser(
                                          user._id
                                        )
                                      }
                                    >
                                      Delete
                                    </button>

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </section>

              )}


              {/* ==================================================
                  CARTS
              ================================================== */}

              {activeTab ===
                "carts" &&
                canAccess("carts") && (

                <section>

                  <div className="admin-table-card">

                    <div className="admin-table-header">

                      <h2>
                        Active Carts
                      </h2>

                      <span className="table-count">
                        {
                          carts.length
                        }{" "}
                        active carts
                      </span>

                    </div>


                    <div className="admin-table-wrapper">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              User
                            </th>

                            <th>
                              Email
                            </th>

                            <th>
                              Items
                            </th>

                            <th>
                              Products
                            </th>

                            <th>
                              Cart Value
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {carts.length ===
                          0 ? (

                            <tr>

                              <td
                                colSpan="5"
                                className="empty-table"
                              >
                                No active carts found.
                              </td>

                            </tr>

                          ) : (

                            carts.map(
                              (
                                cart
                              ) => {

                                const itemCount =
                                  cart.items.reduce(
                                    (
                                      total,
                                      item
                                    ) =>
                                      total +
                                      Number(
                                        item.quantity ||
                                        0
                                      ),
                                    0
                                  );


                                const cartValue =
                                  cart.items.reduce(
                                    (
                                      total,
                                      item
                                    ) =>
                                      total +
                                      Number(
                                        item.price ||
                                        0
                                      ) *
                                      Number(
                                        item.quantity ||
                                        0
                                      ),
                                    0
                                  );


                                return (

                                  <tr
                                    key={
                                      cart._id
                                    }
                                  >

                                    <td>

                                      {
                                        cart.userId
                                          ?.name ||
                                        "Unknown"
                                      }

                                    </td>


                                    <td>

                                      {
                                        cart.userId
                                          ?.email ||
                                        "-"
                                      }

                                    </td>


                                    <td>
                                      {
                                        itemCount
                                      }
                                    </td>


                                    <td>

                                      <div className="cart-products">

                                        {cart.items.map(
                                          (
                                            item,
                                            index
                                          ) => (

                                            <div
                                              key={
                                                index
                                              }
                                            >

                                              {
                                                item.title
                                              }{" "}
                                              ×{" "}
                                              {
                                                item.quantity
                                              }

                                            </div>

                                          )
                                        )}

                                      </div>

                                    </td>


                                    <td>

                                      {money(
                                        cartValue
                                      )}

                                    </td>

                                  </tr>

                                );

                              }

                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </section>

              )}


              {/* ==================================================
                  ORDERS
              ================================================== */}

              {activeTab ===
                "orders" &&
                canAccess("orders") && (

                <section>

                  <div className="admin-table-card">

                    <div className="admin-table-header">

                      <h2>
                        All Orders
                      </h2>


                      <span className="table-count">

                        {
                          orders.length
                        }{" "}
                        orders

                      </span>

                    </div>


                    <div className="admin-table-wrapper">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              Order
                            </th>

                            <th>
                              User
                            </th>

                            <th>
                              Email
                            </th>

                            <th>
                              Products
                            </th>

                            <th>
                              Total
                            </th>

                            <th>
                              Status
                            </th>

                            <th>
                              Date
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {orders.length ===
                          0 ? (

                            <tr>

                              <td
                                colSpan="7"
                                className="empty-table"
                              >
                                No orders found.
                              </td>

                            </tr>

                          ) : (

                            orders.map(
                              (
                                order
                              ) => (

                                <tr
                                  key={
                                    order._id
                                  }
                                >

                                  <td>

                                    <strong>

                                      {
                                        order.orderNumber ||
                                        order._id
                                      }

                                    </strong>

                                  </td>


                                  <td>

                                    {
                                      order.userId
                                        ?.name ||
                                      order.customer
                                        ?.name ||
                                      "Unknown"
                                    }

                                  </td>


                                  <td>

                                    {
                                      order.userId
                                        ?.email ||
                                      order.customer
                                        ?.email ||
                                      "-"
                                    }

                                  </td>


                                  <td>

                                    <div className="order-products">

                                      {order.items?.map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <div
                                            key={
                                              index
                                            }
                                          >

                                            {
                                              item.title
                                            }{" "}
                                            ×{" "}
                                            {
                                              item.quantity
                                            }

                                          </div>

                                        )
                                      )}

                                    </div>

                                  </td>


                                  <td>

                                    {money(
                                      order.total
                                    )}

                                  </td>


                                  <td>

                                    <span
                                      className={`order-status ${
                                        String(
                                          order.orderStatus ||
                                          "Placed"
                                        )
                                          .toLowerCase()
                                          .replace(
                                            /\s+/g,
                                            "-"
                                          )
                                      }`}
                                    >

                                      {
                                        order.orderStatus ||
                                        "Placed"
                                      }

                                    </span>

                                  </td>


                                  <td>

                                    {order.createdAt

                                      ? new Date(
                                          order.createdAt
                                        ).toLocaleDateString(
                                          "en-IN"
                                        )

                                      : "-"}

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </section>

              )}

            </>

          )}

        </main>

      </div>

    );

  };


export default AdminDashboard;