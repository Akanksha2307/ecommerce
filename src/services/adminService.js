const API_URL =
  `${import.meta.env.VITE_API_URL}/api/admin`;

const getToken = () => {

  return localStorage.getItem(
    "adminToken"
  );

};


const request = async (
  endpoint,
  options = {}
) => {

  const token =
    getToken();


  const isFormData =
    options.body instanceof FormData;


  const headers = {

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),

  };


  if (!isFormData) {

    headers[
      "Content-Type"
    ] =
      "application/json";

  }


  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );


  let data = {};

  try {

    data =
      await response.json();

  } catch {

    data = {};

  }


  if (!response.ok) {

    if (
      response.status === 401
    ) {

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

      throw new Error(
        "Admin session expired"
      );

    }


    throw new Error(
      data.message ||
      "Something went wrong"
    );

  }


  return data;

};


// ======================================================
// LOGIN
// ======================================================

export const adminLogin =
  async (
    email,
    password
  ) => {

    const data =
      await request(
        "/login",
        {

          method:
            "POST",

          body:
            JSON.stringify({

              email,

              password,

            }),

        }
      );


    if (
      data.token
    ) {

      localStorage.setItem(
        "adminToken",
        data.token
      );

    }


    if (
      data.admin?.email
    ) {

      localStorage.setItem(
        "adminEmail",
        data.admin.email
      );

    }


    if (
      data.admin?.permissions
    ) {

      localStorage.setItem(

        "adminPermissions",

        JSON.stringify(
          data.admin.permissions
        )

      );

    }


    return data;

  };


// ======================================================
// DASHBOARD
// ======================================================

export const getAdminStats =
  async () => {

    return request(
      "/stats"
    );

  };


// ======================================================
// PRODUCTS
// ======================================================

export const getAdminProducts =
  async () => {

    return request(
      "/products"
    );

  };


export const addAdminProduct =
  async (
    product
  ) => {

    return request(
      "/products",
      {

        method:
          "POST",

        body:
          JSON.stringify(
            product
          ),

      }
    );

  };


export const updateAdminProduct =
  async (
    id,
    product
  ) => {

    return request(
      `/products/${id}`,
      {

        method:
          "PUT",

        body:
          JSON.stringify(
            product
          ),

      }
    );

  };


export const deleteAdminProduct =
  async (
    id
  ) => {

    return request(
      `/products/${id}`,
      {

        method:
          "DELETE",

      }
    );

  };


// ======================================================
// PRODUCT IMAGE
// ======================================================

export const uploadProductImage =
  async (
    imageFile
  ) => {

    const formData =
      new FormData();


    formData.append(
      "image",
      imageFile
    );


    return request(
      "/products/upload-image",
      {

        method:
          "POST",

        body:
          formData,

      }
    );

  };


// ======================================================
// USERS
// ======================================================

export const getAdminUsers =
  async () => {

    return request(
      "/users"
    );

  };


export const addAdminUser =
  async (
    user
  ) => {

    return request(
      "/users",
      {

        method:
          "POST",

        body:
          JSON.stringify(
            user
          ),

      }
    );

  };


export const updateAdminUser =
  async (
    id,
    user
  ) => {

    return request(
      `/users/${id}`,
      {

        method:
          "PUT",

        body:
          JSON.stringify(
            user
          ),

      }
    );

  };


export const deleteAdminUser =
  async (
    id
  ) => {

    return request(
      `/users/${id}`,
      {

        method:
          "DELETE",

      }
    );

  };


// ======================================================
// CARTS
// ======================================================

export const getAdminCarts =
  async () => {

    return request(
      "/carts"
    );

  };


// ======================================================
// ORDERS
// ======================================================

export const getAdminOrders =
  async () => {

    return request(
      "/orders"
    );

  };