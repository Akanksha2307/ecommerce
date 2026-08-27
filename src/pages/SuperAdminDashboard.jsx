import {
  useEffect,
  useState,
} from "react";

import {
  createAdmin,
  getAdmins,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "../services/superAdminService";

import "./SuperAdmin.css";


// ======================================================
// EMPTY ADMIN FORM
// ======================================================

const emptyAdmin = {

  name: "",

  email: "",

  password: "",

  permissions: {

    products: false,

    users: false,

    carts: false,

    orders: false,

  },

};


// ======================================================
// SUPER ADMIN DASHBOARD
// ======================================================

const SuperAdminDashboard = () => {

  // ====================================================
  // ADMINS
  // ====================================================

  const [
    admins,
    setAdmins,
  ] = useState([]);


  // ====================================================
  // FORM
  // ====================================================

  const [
    form,
    setForm,
  ] = useState({
    ...emptyAdmin,
    permissions: {
      ...emptyAdmin.permissions,
    },
  });


  // ====================================================
  // EDITING ADMIN ID
  // ====================================================

  const [
    editingAdminId,
    setEditingAdminId,
  ] = useState(null);


  // ====================================================
  // LOADING
  // ====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // ====================================================
  // SAVING
  // ====================================================

  const [
    saving,
    setSaving,
  ] = useState(false);


  // ====================================================
  // LOAD ADMINS
  // ====================================================

  const loadAdmins = async () => {

    try {

      setLoading(true);


      const data =
        await getAdmins();


      setAdmins(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (
      error
    ) {

      console.error(
        "Load admins error:",
        error
      );


      alert(
        error.message ||
        "Failed to load admins"
      );

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // LOAD ADMINS ON PAGE LOAD
  // ====================================================

  useEffect(() => {

    loadAdmins();

  }, []);


  // ====================================================
  // NORMAL INPUT CHANGE
  // ====================================================

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;


    setForm(
      (previous) => ({

        ...previous,

        [name]:
          value,

      })
    );

  };


  // ====================================================
  // PERMISSION CHANGE
  // ====================================================

  const handlePermission = (
    permission
  ) => {

    setForm(
      (previous) => ({

        ...previous,

        permissions: {

          ...previous.permissions,

          [permission]:
            !previous.permissions[
              permission
            ],

        },

      })
    );

  };


  // ====================================================
  // RESET FORM
  // ====================================================

  const resetForm = () => {

    setForm({

      ...emptyAdmin,

      permissions: {

        ...emptyAdmin.permissions,

      },

    });


    setEditingAdminId(null);

  };


  // ====================================================
  // EDIT ADMIN
  // ====================================================

  const handleEdit = (
    admin
  ) => {

    setEditingAdminId(
      admin._id
    );


    setForm({

      name:
        admin.name || "",

      email:
        admin.email || "",

      // Password remains empty while editing.
      // If the Super Admin enters a password,
      // it will be changed.

      password: "",

      permissions: {

        products:
          Boolean(
            admin.permissions
              ?.products
          ),

        users:
          Boolean(
            admin.permissions
              ?.users
          ),

        carts:
          Boolean(
            admin.permissions
              ?.carts
          ),

        orders:
          Boolean(
            admin.permissions
              ?.orders
          ),

      },

    });


    window.scrollTo({

      top: 0,

      behavior:
        "smooth",

    });

  };


  // ====================================================
  // SUBMIT
  //
  // CREATE NEW ADMIN
  // OR
  // UPDATE EXISTING ADMIN
  // ====================================================

  const submit = async (
    e
  ) => {

    e.preventDefault();


    try {

      setSaving(true);


      // ==================================================
      // EDIT EXISTING ADMIN
      // ==================================================

      if (
        editingAdminId
      ) {

        const updateData = {

          name:
            form.name.trim(),

          email:
            form.email
              .toLowerCase()
              .trim(),

          permissions: {

            products:
              Boolean(
                form.permissions
                  .products
              ),

            users:
              Boolean(
                form.permissions
                  .users
              ),

            carts:
              Boolean(
                form.permissions
                  .carts
              ),

            orders:
              Boolean(
                form.permissions
                  .orders
              ),

          },

        };


        // ==============================================
        // ONLY SEND PASSWORD IF ENTERED
        // ==============================================

        if (
          form.password.trim()
        ) {

          updateData.password =
            form.password;

        }


        console.log(
          "Updating admin:",
          editingAdminId
        );

        console.log(
          "Updated permissions:",
          updateData.permissions
        );


        await updateAdmin(

          editingAdminId,

          updateData

        );


        alert(
          "Admin updated successfully"
        );

      }

      // ==================================================
      // CREATE NEW ADMIN
      // ==================================================

      else {

        const createData = {

          name:
            form.name.trim(),

          email:
            form.email
              .toLowerCase()
              .trim(),

          password:
            form.password,

          permissions: {

            products:
              Boolean(
                form.permissions
                  .products
              ),

            users:
              Boolean(
                form.permissions
                  .users
              ),

            carts:
              Boolean(
                form.permissions
                  .carts
              ),

            orders:
              Boolean(
                form.permissions
                  .orders
              ),

          },

        };


        await createAdmin(
          createData
        );


        alert(
          "Admin created successfully"
        );

      }


      // ==================================================
      // RESET FORM
      // ==================================================

      resetForm();


      // ==================================================
      // RELOAD ADMINS
      //
      // This is important because the updated
      // permissions must immediately appear in
      // the table.
      // ==================================================

      await loadAdmins();

    } catch (
      error
    ) {

      console.error(
        "Save admin error:",
        error
      );


      alert(
        error.message ||
        "Failed to save admin"
      );

    } finally {

      setSaving(false);

    }

  };


  // ====================================================
  // TOGGLE STATUS
  // ====================================================

  const handleStatus = async (
    id
  ) => {

    try {

      await toggleAdminStatus(
        id
      );


      await loadAdmins();

    } catch (
      error
    ) {

      console.error(
        "Toggle admin status error:",
        error
      );


      alert(
        error.message ||
        "Failed to update admin status"
      );

    }

  };


  // ====================================================
  // DELETE ADMIN
  // ====================================================

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this admin?"
      );


    if (
      !confirmed
    ) {

      return;

    }


    try {

      await deleteAdmin(
        id
      );


      // If the deleted admin was
      // currently being edited,
      // clear the form.

      if (
        editingAdminId === id
      ) {

        resetForm();

      }


      await loadAdmins();

    } catch (
      error
    ) {

      console.error(
        "Delete admin error:",
        error
      );


      alert(
        error.message ||
        "Failed to delete admin"
      );

    }

  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = () => {

    localStorage.removeItem(
      "superAdminToken"
    );

    localStorage.removeItem(
      "superAdminEmail"
    );

    localStorage.removeItem(
      "superAdminName"
    );


    window.location.href =
      "/super-admin/login";

  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="super-admin-layout">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="super-admin-sidebar">

        <div className="super-admin-brand">

          GreenCart

        </div>


        <div className="super-admin-menu">

          <button
            className="active"
          >

            Dashboard

          </button>


          <button>

            Manage Admins

          </button>


          <button>

            All Products

          </button>


          <button>

            All Orders

          </button>


          <button>

            Customers

          </button>


          <button>

            Revenue & Reports

          </button>


          <button>

            Settings

          </button>

        </div>


        <button
          className="super-admin-logout"
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

      <main className="super-admin-main">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="super-admin-header">

          <div>

            <h1>
              Manage Admins
            </h1>

            <p>
              Create and manage all administrators
            </p>

          </div>


          <button
            className="add-admin-top-button"
            onClick={
              resetForm
            }
          >

            + Add Admin

          </button>

        </div>


        {/* ==================================================
            ADMIN FORM
        ================================================== */}

        <section className="super-admin-card">


          <div className="super-admin-card-title">

            <h2>

              {editingAdminId
                ? "Edit Admin"
                : "Add Admin"}

            </h2>


            {editingAdminId && (

              <button
                type="button"
                className="cancel-edit"
                onClick={
                  resetForm
                }
              >

                Cancel

              </button>

            )}

          </div>


          <form
            className="add-admin-form"
            onSubmit={
              submit
            }
          >


            {/* NAME */}

            <input
              name="name"
              placeholder="Name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />


            {/* EMAIL */}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              required
            />


            {/* PASSWORD */}

            <input
              name="password"
              type="password"
              placeholder={
                editingAdminId
                  ? "Password (leave empty to keep current password)"
                  : "Password"
              }
              value={
                form.password
              }
              onChange={
                handleChange
              }
              required={
                !editingAdminId
              }
            />


            {/* ==================================================
                PERMISSIONS
            ================================================== */}

            <div className="permissions-section">

              <h3>
                Permissions:
              </h3>


              <div className="permissions-grid">


                {/* PRODUCTS */}

                <label>

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        form.permissions
                          .products
                      )
                    }
                    onChange={() =>
                      handlePermission(
                        "products"
                      )
                    }
                  />

                  Products

                </label>


                {/* USERS */}

                <label>

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        form.permissions
                          .users
                      )
                    }
                    onChange={() =>
                      handlePermission(
                        "users"
                      )
                    }
                  />

                  Users

                </label>


                {/* CARTS */}

                <label>

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        form.permissions
                          .carts
                      )
                    }
                    onChange={() =>
                      handlePermission(
                        "carts"
                      )
                    }
                  />

                  Carts

                </label>


                {/* ORDERS */}

                <label>

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        form.permissions
                          .orders
                      )
                    }
                    onChange={() =>
                      handlePermission(
                        "orders"
                      )
                    }
                  />

                  Orders

                </label>

              </div>

            </div>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="create-admin-button"
              disabled={
                saving
              }
            >

              {saving

                ? editingAdminId
                  ? "Updating..."
                  : "Creating..."

                : editingAdminId
                  ? "Update Admin"
                  : "Create Admin"}

            </button>

          </form>

        </section>


        {/* ==================================================
            ADMIN LIST
        ================================================== */}

        <section className="super-admin-card">


          <div className="admins-table-wrapper">

            {loading ? (

              <div className="super-admin-loading">

                Loading admins...

              </div>

            ) : (

              <table className="admins-table">

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
                      Permissions
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {admins.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-admins"
                      >

                        No administrators found.

                      </td>

                    </tr>

                  ) : (

                    admins.map(
                      (
                        admin
                      ) => (

                        <tr
                          key={
                            admin._id
                          }
                        >


                          {/* NAME */}

                          <td>

                            <strong>

                              {
                                admin.name
                              }

                            </strong>

                          </td>


                          {/* EMAIL */}

                          <td>

                            {
                              admin.email
                            }

                          </td>


                          {/* ROLE */}

                          <td>

                            <span className="admin-role-badge">

                              {
                                admin.role
                              }

                            </span>

                          </td>


                          {/* PERMISSIONS */}

                          <td>

                            <div className="permission-tags">


                              {admin.permissions
                                ?.products && (

                                <span>
                                  Products
                                </span>

                              )}


                              {admin.permissions
                                ?.users && (

                                <span>
                                  Users
                                </span>

                              )}


                              {admin.permissions
                                ?.carts && (

                                <span>
                                  Carts
                                </span>

                              )}


                              {admin.permissions
                                ?.orders && (

                                <span>
                                  Orders
                                </span>

                              )}


                              {!admin.permissions
                                ?.products &&
                                !admin.permissions
                                  ?.users &&
                                !admin.permissions
                                  ?.carts &&
                                !admin.permissions
                                  ?.orders && (

                                  <span>
                                    —
                                  </span>

                                )}

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                admin.status ===
                                "active"

                                  ? "status-active"

                                  : "status-inactive"
                              }
                            >

                              {
                                admin.status
                              }

                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td>

                            <div className="admin-actions">


                              {/* EDIT */}

                              <button
                                type="button"
                                className="edit-admin-button"
                                onClick={() =>
                                  handleEdit(
                                    admin
                                  )
                                }
                              >

                                Edit

                              </button>


                              {/* STATUS */}

                              <button
                                type="button"
                                className={
                                  admin.status ===
                                  "active"

                                    ? "deactivate-button"

                                    : "reactivate-button"
                                }
                                onClick={() =>
                                  handleStatus(
                                    admin._id
                                  )
                                }
                              >

                                {admin.status ===
                                "active"

                                  ? "Deactivate"

                                  : "Reactivate"}

                              </button>


                              {/* DELETE */}

                              <button
                                type="button"
                                className="delete-admin-button"
                                onClick={() =>
                                  handleDelete(
                                    admin._id
                                  )
                                }
                              >

                                Delete

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>

    </div>

  );

};


export default SuperAdminDashboard;