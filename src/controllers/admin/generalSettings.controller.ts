import { Request, Response } from "express";
import MSG from "@utils/locale.en.json";
import { validationResult } from "express-validator";
import { RequestWithUser } from "@/interfaces/auth.interface";
import footageModel from "@/models/foogate.model";
import { isValidObjectId } from "mongoose";
import generalSettingsModel from "@/models/generalSettings.model";

interface Query {
  name: object;
  state: string;
  city: string;
  date: object;
}
class generalSettingsController {
  public async getGeneralSettings(req: RequestWithUser, res: Response) {
    try {
      const settings = await generalSettingsModel.find();
      res.status(200).json({ success: true, settings: settings[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Register
  public async getFootage(req: Request, res: Response) {
    try {
      const { state, city, fromDate, toDate, name, page, limit, sortBy } =
        req.query;
      let query = {} as Query;

      if (state) {
        query.state = state as string;
      }
      if (city) {
        query.city = city as string;
      }

      if (fromDate && toDate) {
        query.date = { $gte: fromDate as string, $lte: toDate as string };
      }

      if (name) {
        query.name = { $regex: name as string, $options: "i" };
      }

      const sortOptions = {};

      if (sortBy === "new") {
        sortOptions["createdAt"] = -1;
      } else if (sortBy === "old") {
        sortOptions["createdAt"] = 1;
      }

      if (sortBy === "asc") {
        sortOptions["name"] = 1;
      } else if (sortBy === "desc") {
        sortOptions["name"] = -1;
      }

      const currentPage = parseInt(page as string) || 1;
      const documentsLimit = parseInt(limit as string) || 10;
      const startIndex = (currentPage - 1) * documentsLimit;

      const totalCount = await footageModel.countDocuments(query);

      const results = await footageModel
        .find(query)
        .sort(sortOptions)
        .limit(documentsLimit)
        .skip(startIndex);

      res.status(200).json({ success: true, result: results, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async notificationSettings(req: Request, res: Response) {
    try {
      const { sellClaimRequest, affiliateRequest, freeFootageRequest } =
        req.body;
      const { id } = req.params;

      console.log(id);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const filter = { _id: id };

      const update = {
        sellClaimRequest,
        affiliateRequest,
        freeFootageRequest,
      };

      console.log(update);

      const updatedDocument = await generalSettingsModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        }
      );

      if (!updatedDocument) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }

      res.status(200).json({
        success: true,
        message: "Update successful",
        data: updatedDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  public async requestSettings(req: Request, res: Response) {
    try {
      const {
        commisionRate,
        affiliateTermsCondition,
        sellClaimTermsCondition,
      } = req.body;
      const { id } = req.params;

      console.log(id);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const filter = { _id: id };

      const update = {
        commisionRate,
        affiliateTermsCondition,
        sellClaimTermsCondition,
      };

      console.log(update);

      const updatedDocument = await generalSettingsModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        }
      );

      if (!updatedDocument) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }

      res.status(200).json({
        success: true,
        message: "Update successful",
        data: updatedDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default generalSettingsController;
