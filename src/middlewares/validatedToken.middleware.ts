import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import adminModel from "@models/admin.model";
import MSG from "@utils/locale.en.json";
import { isValidObjectId } from "mongoose";
import resetPassModel from "@/models/resetToken.model";

const validatedTokenMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, id } = req.query;

    if (!token || !id)
      return res.status(401).json({ message: "Invalid request!" });

    if (!isValidObjectId(id))
      return res.status(401).json({ message: "Invalid user" });

    const user = await adminModel.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = await resetPassModel.findOne({ user: user._id });

    if (!resetToken)
      return res.status(404).json({ message: "Reset token not found!" });

    const isValid = resetToken.token === token;

    if (!isValid)
      return res.status(401).json({ message: "Reset token is invalid!" });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: MSG.AUTH_WRONG });
  }
};

export default validatedTokenMiddleware;
