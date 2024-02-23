import { RequestWithSubscription } from "@/interfaces/auth.interface";
import { NextFunction, Response } from "express";

const checkSubscriptionValidity = (
  req: RequestWithSubscription,
  res: Response,
  next: NextFunction
) => {
  // Assuming the user object is attached to the request
  const user = req.user;

  // Get the current timestamp
  const currentTimestamp = Date.now();

  // Compare the current timestamp with the expiration timestamp
  if (
    user &&
    user.expireAt &&
    currentTimestamp <= new Date(user.expireAt).getTime()
  ) {
    // Subscription is valid
    next();
  } else {
    // Subscription has expired
    res.status(401).json({ error: "Subscription has expired" });
  }
};

export default checkSubscriptionValidity;
