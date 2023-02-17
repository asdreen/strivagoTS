import express, { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware, UserRequest } from "../../lib/auth/jwtAuth";
import { createAccessToken } from "../../lib/auth/tools";
import UsersModel from "./model";
import AccommodationsModel from "../accommodation/model";
import { checkUsersSchema, checkValidationResult } from "./validator";

interface Tokens {
  accessToken: string;
}

const usersRouter = express.Router();

// REGISTER USER

usersRouter.post(
  "/register",
  checkUsersSchema,
  checkValidationResult,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, `Credentials are not ok!`));
    }
  } catch (error) {
    next(error);
  }
});

// GET ME

usersRouter.get(
  "/me",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const users = await UsersModel.findById(req.user?._id);
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

//PUT ME

usersRouter.put(
  "/me",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.user!._id,
        req.body,
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(404, `user with id ${req.user!._id} is not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE ME

usersRouter.delete(
  "/me",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const deletedUser = await UsersModel.findByIdAndDelete(req.user!._id);
      if (deletedUser) {
        res.status(204).send();
      } else {
        next(
          createHttpError(404, `user with id ${req.user!._id} is not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// PUT ID

usersRouter.put("/:userId", async (req: UserRequest, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `user with id ${req.user!._id} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

// DELETE ID

usersRouter.delete("/:userId", async (req: UserRequest, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `user with id ${req.user!._id} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

// GET MY ACCOMMODATIONS (HOST ONLY)

usersRouter.get(
  "/me/accommodations",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const accommodations = await AccommodationsModel.find({
        host: req.user!._id,
      });

      if (accommodations) {
        res.send(accommodations);
      } else {
        next(
          createHttpError(
            404,
            `No accommodations hosted by user ${req.user!._id} were found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
export default usersRouter;
