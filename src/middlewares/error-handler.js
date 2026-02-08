const errorHandler = (err, req, res, next) => {
  // Default response
  let statusCode = 500;
  let response = {
    success: false,
    message: "Something went wrong on the server",
  };

  /**
   * 1️⃣ Handle Zod / validation-like errors
   * These errors usually have `details` as an array
   */
  if (Array.isArray(err.details)) {
    statusCode = 400;
    response.message = "Validation failed";
    response.errors = {};

    err.details.forEach((detail) => {
      // If path exists, use field name
      if (detail.path && detail.path.length > 0) {
        const fieldName = detail.path.join(".");
        response.errors[fieldName] = detail.message;
      } else {
        // No field (invalid body, undefined input)
        response.message = detail.message;
      }
    });

    return res.status(statusCode).json(response);
  }

  /**
   * 2️⃣ Handle custom thrown errors (business logic)
   * Example: throw new Error("User already exists")
   */
  if (err instanceof Error) {
    statusCode = 400;
    response.message = err.message;

    return res.status(statusCode).json(response);
  }

  /**
   * 3️⃣ Fallback for unknown errors
   */
  return res.status(statusCode).json(response);
};

export { errorHandler };
