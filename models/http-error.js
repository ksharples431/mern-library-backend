class HttpError extends Error {
  constructor(message, errorCode) {
    super(message, errorCode);
    this.code = errorCode;
  }
}


module.exports = HttpError;
