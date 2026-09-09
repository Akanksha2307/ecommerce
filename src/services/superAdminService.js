const API_URL =
  `${import.meta.env.VITE_API_URL}/api/super-admin`;

// ======================================================
// TOKEN
// ======================================================

const getToken =
  () => {

    return localStorage.getItem(
      "superAdminToken"
    );

  };


// ======================================================
// REQUEST
// ======================================================

const request =
  async (
    endpoint,
    options = {}
  ) => {

    const token =
      getToken();


    const response =
      await fetch(

        `${API_URL}${endpoint}`,

        {

          ...options,

          headers: {

            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),

            ...(options.headers ||
              {}),

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
        "Something went wrong"

      );

    }


    return data;

  };


// ======================================================
// LOGIN
// ======================================================

export const superAdminLogin =
  async (
    email,
    password
  ) => {

    return request(

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

  };


// ======================================================
// GET ADMINS
// ======================================================

export const getAdmins =
  async () => {

    return request(
      "/admins"
    );

  };


// ======================================================
// CREATE ADMIN
// ======================================================

export const createAdmin =
  async (
    admin
  ) => {

    return request(

      "/admins",

      {

        method:
          "POST",

        body:
          JSON.stringify(
            admin
          ),

      }

    );

  };


// ======================================================
// UPDATE ADMIN
// ======================================================

export const updateAdmin =
  async (
    id,
    admin
  ) => {

    return request(

      `/admins/${id}`,

      {

        method:
          "PUT",

        body:
          JSON.stringify(
            admin
          ),

      }

    );

  };


// ======================================================
// TOGGLE STATUS
// ======================================================

export const toggleAdminStatus =
  async (
    id
  ) => {

    return request(

      `/admins/${id}/status`,

      {

        method:
          "PATCH",

      }

    );

  };


// ======================================================
// DELETE ADMIN
// ======================================================

export const deleteAdmin =
  async (
    id
  ) => {

    return request(

      `/admins/${id}`,

      {

        method:
          "DELETE",

      }

    );

  };