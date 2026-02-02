const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  let status = err?.status || err?.statusCode || 500;
  let message = "Internal Server Error";
  let details;

  // If the thrown value is an array (e.g. serialized zod errors)
  if (Array.isArray(err)) {
    status = 400;
    details = err;
    message = err[0]?.message || "Validation error";

    // If it's an object (Error instance or plain object)
  } else if (err && typeof err === "object") {
    // Common shapes from validation libs
    if (Array.isArray(err.errors)) {
      status = status === 500 ? 400 : status;
      details = err.errors;
      message = err.message || err.errors[0]?.message || "Validation error";
    } else if (Array.isArray(err.issues)) {
      status = status === 500 ? 400 : status;
      details = err.issues;
      message = err.message || err.issues[0]?.message || "Validation error";
      // Plain object with `error` field
    } else if (typeof err.error === "string") {
      message = err.error;
      // If `message` exists, try to parse JSON inside it (some code throws JSON-stringified arrays)
    } else if (typeof err.message === "string") {
      try {
        const parsed = JSON.parse(err.message);
        if (Array.isArray(parsed)) {
          status = 400;
          details = parsed;
          message = parsed[0]?.message || "Validation error";
        } else if (parsed && typeof parsed === "object") {
          message = parsed.message || parsed.error || err.message;
          details = parsed;
        } else {
          message = err.message;
        }
      } catch (e) {
        message = err.message;
      }
      // fallback: return the object as details
    } else if (Object.keys(err).length > 0) {
      details = err;
      message = err.message || err.error || JSON.stringify(err);
    }

    // If it's a plain string
  } else if (typeof err === "string") {
    status = 400;
    message = err;
  } else {
    message = String(err);
  }

  const body = { message };
  if (details) body.details = details;
  if (!isProduction && err?.stack) body.stack = err.stack;

  console.log(`🟡 LOG - body: `, body);
  res.status(status).json(body);
};

export { errorHandler };
