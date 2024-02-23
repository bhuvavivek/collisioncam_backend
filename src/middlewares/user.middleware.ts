import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "@exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithSubscription,
} from "@interfaces/auth.interface";
import MSG from "@utils/locale.en.json";
import subscriptionModel from "@/models/subscription.model";

const userMiddleware = async (
  req: RequestWithSubscription,
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
      const findUser = await subscriptionModel.findById(userId);
      findUser.password = undefined;
      const currentTimestamp = Date.now();
      const isValidSubscription =
        currentTimestamp <= new Date(findUser.expireAt).getTime();
      if (findUser) {
        req.user = findUser;
        req.isValidSubscription = isValidSubscription;
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

export default userMiddleware;
