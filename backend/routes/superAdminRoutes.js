import express from "express";

import {
  superAdminLogin,
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "../controllers/superAdminController.js";

import superAdminMiddleware
  from "../middleware/superAdminMiddleware.js";


const router =
  express.Router();


// ======================================================
// SUPER ADMIN LOGIN
// PUBLIC
// ======================================================

router.post(
  "/login",
  superAdminLogin
);


// ======================================================
// SUPER ADMIN AUTH
// ======================================================

router.use(
  superAdminMiddleware
);


// ======================================================
// ADMINS
// ======================================================

router.get(
  "/admins",
  getAdmins
);


router.post(
  "/admins",
  createAdmin
);


router.put(
  "/admins/:id",
  updateAdmin
);


router.patch(
  "/admins/:id/status",
  toggleAdminStatus
);


router.delete(
  "/admins/:id",
  deleteAdmin
);


export default router;