import { Request, Response } from "express";
// import userService from "@services/users.service";
import MSG from "@utils/locale.en.json";
import adminModel from "@/models/admin.model";
import { Admin } from "@/interfaces/admin.interface";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "@/interfaces/auth.interface";
import resetPassModel from "@/models/resetToken.model";
import { createRandomBytes } from "@/utils/helper";
import sendMail from "@/utils/mail";
import { forgotpasswordTemplete } from "@/email-template/Template";

class AdminAuthController {
  // get profile
  public async getProfile(req: RequestWithUser, res: Response) {
    try {
      const user = req.user;
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Login
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = (await adminModel.findOne({ email })) as Admin;
      if (!existingUser)
        return res.status(402).json({ message: MSG.WORNG_CREDENTIAL });
      const isMatched = bcrypt.compareSync(password, existingUser?.password);

      console.log(isMatched);

      if (!isMatched)
        return res.status(402).json({ message: MSG.WORNG_CREDENTIAL });

      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRECT,
        {
          expiresIn: "30d",
        }
      );

      existingUser.password = undefined;

      res.status(200).json({
        success: true,
        message: MSG.LOGIN_SUCCESS,
        token,
        user: existingUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Register
  public async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }
      const existingUser = await adminModel.findOne({ email });
      if (existingUser)
        return res.status(402).json({ message: MSG.USER_EXIST });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = new adminModel({
        email,
        password: hash,
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT, {
        expiresIn: "30d",
      });

      res
        .status(200)
        .json({ success: true, message: MSG.SIGNUP_SUCCESS, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Forgot password
  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = (await adminModel.findOne({ email })) as Admin;
      if (!existingUser)
        return res
          .status(402)
          .json({ message: MSG.EMAIL_NOT_FOUND.replace("%email%", email) });

      const randomBytes = await createRandomBytes();

      const token = await resetPassModel.findOne({ user: existingUser?._id });

      if (token) {
        await resetPassModel.findByIdAndDelete(token._id);
      }

      const resetToken = new resetPassModel({
        user: existingUser._id,
        token: randomBytes,
      });

      await resetToken.save();

      const url = `https://password.collisioncam.org/reset-password?token=${randomBytes}&id=${existingUser._id}`;

      sendMail({
        to: email,
        html: forgotpasswordTemplete({ url }),
        title: "Password Reset Request Confirmation",
      });

      res.status(200).json({
        success: true,
        message: "Reset token send to " + email + " this mail",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Resete Password
  public async resetPassword(req: RequestWithUser, res: Response) {
    try {
      const { password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = await adminModel.findById(req.user);

      if (!existingUser)
        return res.status(404).json({ message: "User not found" });

      const isSamePassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isSamePassword)
        return res
          .status(401)
          .json({ message: "New password must be different!" });

      const salt = bcrypt.genSaltSync(10);
      existingUser.password = bcrypt.hashSync(password, salt);

      await existingUser.save();

      await resetPassModel.findOneAndDelete({ user: existingUser._id });
      res.json({
        success: true,
        message: "Password reset successfully",
        existingUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Change password
  public async changePassword(req: RequestWithUser, res: Response) {
    try {
      const { password, newPassword } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = await adminModel.findById(req?.user?._id);

      if (!existingUser)
        return res.status(404).json({ message: "User not found" });

      const isSameCurrentPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isSameCurrentPassword)
        return res.status(401).json({ message: "Invalid password" });

      const salt = bcrypt.genSaltSync(10);
      existingUser.password = bcrypt.hashSync(newPassword, salt);

      await existingUser.save();

      existingUser.password = undefined;
      res.json({
        success: true,
        message: "Password change successfully",
        existingUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // General Settings
  public async generalSettings(req: RequestWithUser, res: Response) {
    try {
      const { phone, email, address } = req.body;

      if (!phone && !email && !address)
        return res
          .status(404)
          .json({ message: "Atleast one feilds is required" });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = await adminModel.findById(req?.user?._id);
      if (!existingUser)
        return res.status(401).json({ message: "Invalid user" });

      if (phone) existingUser.phone = phone;
      if (email) existingUser.email = email;
      if (address) existingUser.address = address;

      await existingUser.save();

      existingUser.password = undefined;
      res.json({
        success: true,
        message: "General setting changed successfully",
        existingUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default AdminAuthController;
