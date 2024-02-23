import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import adminModel from "@models/admin.model";
import MSG from "@utils/locale.en.json";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.header("Authorization").split("Bearer ")[1] ||
      req.cookies["Authorization"] ||
      null;

    if (Authorization) {
      const verificationResponse = (await jwt.verify(
        Authorization,
        process.env.JWT_SECRECT
      )) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await adminModel.findById(userId);
      findUser.password = undefined;
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, MSG.UNAUTHORIZED));
        next();
      }
    } else {
      next(new HttpException(404, MSG.AUTH_MISSING));
    }
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: MSG.AUTH_WRONG });
  }
};

export default authMiddleware;
