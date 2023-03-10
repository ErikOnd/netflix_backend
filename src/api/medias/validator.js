import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogPostsSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },

  year: {
    in: ["body"],
    isString: {
      errorMessage: "Year is a mandatory field and needs to be a string!",
    },
  },

  type: {
    in: ["body"],
    isString: {
      errorMessage: "Type is a mandatory field and needs to be a string!",
    },
  },

  poster: {
    in: ["body"],
    isString: {
      errorMessage: "Poster is a mandatory field and needs to be a string!",
    },
  },
};

export const checkMediasSchema = checkSchema(blogPostsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during blogPost validation", {
        errorsList: errors.array(),
      })
    );
  }
};
