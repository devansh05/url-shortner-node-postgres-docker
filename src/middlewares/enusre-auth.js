import jwt from "jsonwebtoken";
function ensureAuthenticated(req, res, next) {
  try {
    const isPublicRoute =
      "/users/login" === req.path || "/users/signup" === req.path;

    if (isPublicRoute) {
      return next();
    }

    const tokenHeader = req.headers["authorization"];
    // Header authorization : Bearer <token>
    if (!tokenHeader) {
      throw new Error("No bearer token available.");
    }

    if (!tokenHeader.startsWith("Bearer")) {
      throw new Error("The token must start with - Bearer");
    }

    const token = tokenHeader.split(" ")[1];

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData;
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
}

export { ensureAuthenticated };
