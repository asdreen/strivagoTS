import { checkSchema, Schema, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { RequestHandler } from "express";

const accommodationSchema: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and must be a string/text",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and must be a string/text",
    },
  },
  maxGuests: {
    in: ["body"],
    isInt: {
      errorMessage: "Max Guests is a mandatory field and must be an integer",
    },
  },
  city: {
    in: ["body"],
    isString: {
      errorMessage: "City is a mandatory field and must be a string/text",
    },
  },
};

export const checkAccommodationSchema = checkSchema(accommodationSchema);

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
