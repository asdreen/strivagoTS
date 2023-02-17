import { RequestHandler } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const usersSchema: Schema = {
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email is a mandatory field and must be a string/text",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password is a mandatory field and must be a string/text",
    },
  },
  role: {
    in: ["body"],
    isString: {
      errorMessage: "Role is a mandatory field and must be a string/text",
    },
    isIn: {
      options: ["Host,Guest"],
      errorMessage: "Role must be either 'Host' or 'Guest'",
    },
  },
};

export const checkUsersSchema = checkSchema(usersSchema);

export const checkValidationResult: RequestHandler = (req, res, next) => {
  const errorsList = validationResult(req);
  if (!errorsList.isEmpty()) {
    next(
      createHttpError(
        400,
        "Validation error in request! Error(s) are displayed below",
        { errorsList: errorsList.array() }
      )
    );
  } else {
    next();
  }
};
