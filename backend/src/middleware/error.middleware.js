module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const errStatusCode = err.statusCode || 500;
  res
    .status(errStatusCode)
    .json({ success: false, message: err.message || "Internal Server Error" });
};
