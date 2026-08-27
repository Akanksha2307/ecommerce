import jwt from "jsonwebtoken";


// ======================================================
// SUPER ADMIN AUTHENTICATION
// ======================================================

const superAdminMiddleware =
  (
    req,
    res,
    next
  ) => {

    try {

      const authHeader =
        req.headers.authorization;


      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {

        return res.status(401).json({

          message:
            "Super Admin authentication required",

        });

      }


      const token =
        authHeader.split(
          " "
        )[1];


      if (!token) {

        return res.status(401).json({

          message:
            "Super Admin token missing",

        });

      }


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      if (
        decoded.role !==
        "superadmin"
      ) {

        return res.status(403).json({

          message:
            "Super Admin access required",

        });

      }


      req.superAdmin =
        decoded;


      next();

    } catch (
      error
    ) {

      console.error(
        "Super Admin authentication error:",
        error
      );


      return res.status(401).json({

        message:
          "Invalid or expired Super Admin token",

      });

    }

  };


export default superAdminMiddleware;