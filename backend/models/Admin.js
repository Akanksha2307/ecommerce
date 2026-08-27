import mongoose from "mongoose";

// ======================================================
// ADMIN SCHEMA
// ======================================================

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  status: { type: String, enum: ["active", "deactivated"], default: "active" },

  permissions: {
    products: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    carts: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
  },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;