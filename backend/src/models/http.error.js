export class httpError extends Error {
  constructor(message, errCode, errors = {}) {
    super(message); //Add a 'message' property
    this.code = errCode;
    this.errors = errors;
  }
}
