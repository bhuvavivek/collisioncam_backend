import { Request } from "express";
import { Admin } from "@interfaces/admin.interface";
import { Subscription } from "./subscription.interface";

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: Admin;
  userId: string;
  flash: any;
  fileName: string;
  files: object
}

export interface RequestWithSubscription extends Request {
  user: Subscription;
  isValidSubscription: boolean;
  userId: string;
  flash: any;
  fileName: string;
  files: object;
}
