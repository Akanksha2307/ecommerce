import jwt from "jsonwebtoken";

// ======================================================
// ADMIN AUTHENTICATION + PERMISSION MIDDLEWARE
// ======================================================

const adminMiddleware = (requiredPermission = null) => {

  return (req, res, next) => {

    try {

      // ========================================
      // GET AUTHORIZATION HEADER
      // ========================================

      const authHeader = req.headers.authorization;

      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {

        return res.status(401).json({
          message: "Admin authentication required",
        });

      }


      // ========================================
      // GET TOKEN
      // ========================================

      const token = authHeader.split(" ")[1];

      if (!token) {

        return res.status(401).json({
          message: "Admin token missing",
        });

      }


      // ========================================
      // VERIFY TOKEN
      // ========================================

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );


      // ========================================
      // CHECK ADMIN ROLE
      // ========================================

      if (decoded.role !== "admin") {

        return res.status(403).json({
          message: "Admin access required",
        });

      }


      // ========================================
      // GET ADMIN PERMISSIONS
      // ========================================

      const permissions = decoded.permissions || {
        products: false,
        users: false,
        carts: false,
        orders: false,
      };


      // ========================================
      // CHECK REQUIRED PERMISSION
      // ========================================

      if (
        requiredPermission &&
        permissions[requiredPermission] !== true
      ) {

        return res.status(403).json({
          message: `You do not have permission to access ${requiredPermission}`,
        });

      }


      // ========================================
      // ATTACH ADMIN INFORMATION
      // ========================================

      req.admin = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        permissions,
      };


      // ========================================
      // CONTINUE
      // ========================================

      next();

    } catch (error) {

      console.error(
        "Admin authentication error:",
        error
      );


      // ========================================
      // EXPIRED TOKEN
      // ========================================

      if (
        error.name === "TokenExpiredError"
      ) {

        return res.status(401).json({
          message:
            "Admin session expired. Please login again.",
        });

      }


      // ========================================
      // INVALID TOKEN
      // ========================================

      return res.status(401).json({
        message: "Invalid admin token",
      });

    }

  };

};

export default adminMiddleware;