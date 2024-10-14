class AppErr extends Error {
  constructor(msg, statusCode) {
    super(msg, statusCode);
    this.statusCode = statusCode ? statusCode : 500;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppErr;
