const API_URL =
  `${import.meta.env.VITE_API_URL}/api/orders`;

// ========================================
// GET USER TOKEN
// ========================================

const getToken = () => {
  return localStorage.getItem("token");
};


// ========================================
// HANDLE AUTH ERROR
// ========================================

const handleResponse = async (response) => {

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }


  // ========================================
  // TOKEN EXPIRED / INVALID
  // ========================================

  if (
    response.status === 401 ||
    response.status === 403
  ) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      "Your session has expired. Please login again."
    );

  }


  // ========================================
  // OTHER ERROR
  // ========================================

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Something went wrong"
    );

  }


  return data;

};


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  orderData
) => {

  const token = getToken();


  if (!token) {

    throw new Error(
      "Please login first"
    );

  }


  const response =
    await fetch(
      API_URL,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body:
          JSON.stringify(
            orderData
          ),

      }
    );


  return handleResponse(response);

};


// ========================================
// GET ALL USER ORDERS
// ========================================

export const getUserOrders = async () => {

  const token = getToken();


  if (!token) {

    throw new Error(
      "Please login first"
    );

  }


  const response =
    await fetch(
      `${API_URL}/my-orders`,
      {

        method: "GET",

        headers: {

          Authorization:
            `Bearer ${token}`,

        },

      }
    );


  return handleResponse(response);

};


// ========================================
// GET SINGLE ORDER
// ========================================

export const getOrderById = async (
  id
) => {

  const token = getToken();


  if (!token) {

    throw new Error(
      "Please login first"
    );

  }


  const response =
    await fetch(
      `${API_URL}/${id}`,
      {

        method: "GET",

        headers: {

          Authorization:
            `Bearer ${token}`,

        },

      }
    );


  return handleResponse(response);

};