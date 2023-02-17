import jwt from "jsonwebtoken";
import UsersModel from "../../api/user/model";
import { ObjectId } from "mongoose";

interface TokenPayload {
  _id: ObjectId;
  role: "Host" | "Guest";
}

export const createAccessToken = (payload: TokenPayload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyAccessToken = (accessToken: string): Promise<TokenPayload> =>
  new Promise((res, rej) =>
    jwt.verify(accessToken, process.env.JWT_SECRET!, (err, originalPayload) => {
      if (err) rej(err);
      else res(originalPayload as TokenPayload);
    })
  );
