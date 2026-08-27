// ======================================================
// ADMIN PERMISSION MIDDLEWARE
// ======================================================

const adminPermissionMiddleware = (
  permission
) => {

  return (
    req,
    res,
    next
  ) => {

    try {

      // ==================================================
      // CHECK ADMIN
      // ==================================================

      if (
        !req.admin
      ) {

        return res.status(401).json({

          message:
            "Admin authentication required",

        });

      }


      // ==================================================
      // GET PERMISSIONS
      // ==================================================

      const permissions =
        req.admin.permissions || {};


      // ==================================================
      // CHECK PERMISSION
      // ==================================================

      if (
        permissions[permission] !== true
      ) {

        return res.status(403).json({

          message:
            `You do not have permission to access ${permission}`,

          permission,

        });

      }


      // ==================================================
      // ALLOW
      // ==================================================

      next();

    } catch (
      error
    ) {

      console.error(
        "Admin permission error:",
        error
      );


      return res.status(403).json({

        message:
          "Permission denied",

      });

    }

  };

};


export default adminPermissionMiddleware;