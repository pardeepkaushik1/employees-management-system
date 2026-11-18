const errorHandler = (err, req, res, next) => {
  console.error(err);
  console.log('PostgreSQL Error Code:', err.code);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL Duplicate Key Error
  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate data already exists";
  }

  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference ID";
  }

  if (err.code === "NOT_FOUND") {
    statusCode = 404;
  }
  if (err.code === '22P02') {
  statusCode = 400;
  message = 'Invalid ID format';
}

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
