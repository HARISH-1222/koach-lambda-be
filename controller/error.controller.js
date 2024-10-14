import AppError from "../utils/appError";

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else {
    // Want to hide from users
    console.error("Error 🔥", err); // normal log will show the information in console on hosted site.
    res.status(500).json({
      status: "error",
      message: "Somthing went very wrong",
    });
  }
};

const handleJWTerror = (err) =>
  new AppError("Invalid Token.Please Login again", 401);

const handleJWTExpired = (err) =>
  new AppError("Login Expired.Please Login again", 401);

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name == "JsonWebTokenError" && err.message == "invalid token")
      err = handleJWTerror(err);

    if (err.name == "JsonWebTokenError" && err.message == "jwt malformed")
      err = handleJWTExpired(err);
    // JsonWebTokenError
    sendErrProd(err, res);
  }
};
