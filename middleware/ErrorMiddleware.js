const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500

  res.status(statusCode)

  const error = {};
  error['message'] = err.message

  if (process.env.NODE_ENV !== 'prod') {
    error['stack'] = err.stack
  }

  res.json(error)
}

module.exports = {
  errorHandler,
}