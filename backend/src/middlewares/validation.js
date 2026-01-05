import path from "path";
import { httpError } from "../models/http.error.js";
import { validationResult } from "express-validator";

export const validation = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    return next(
      new httpError(
        "Invalid data has beed passed! pleased check your data",
        422,
        errs.array().map((err) => ({
          field: err.param,
          message: err.msg,
          path: err.path,
        }))
      )
    );
  }
  return next();
};
