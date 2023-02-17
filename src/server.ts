import express from "express";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericServerErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import usersRouter from "./api/user/index";
import accommodationsRouter from "./api/accommodation/index";
import { createServer } from "http";
import passport from "passport";
const expressServer = express();

// *****************SOCKET>IO**************************
const httpServer = createServer(expressServer);

// ***************************** MIDDLEWARES ***************************

expressServer.use(cors());
expressServer.use(express.json());
expressServer.use(passport.initialize());

// ****************************** ENDPOINTS ****************************

expressServer.use("/users", usersRouter);
expressServer.use("/accommodations", accommodationsRouter);

// *************************** ERROR HANDLERS **************************

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericServerErrorHandler);

export { expressServer, httpServer };
