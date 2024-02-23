import { RequestWithUser } from "@/interfaces/auth.interface";
import { Response } from "express";
import MSG from "@utils/locale.en.json";
import paymentModel from "@/models/payment.model";
import { isValidObjectId } from "mongoose";

interface PaginationQuery {
  page?: number;
  limit?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  sort?: "asc" | "desc";
}

class PaymentController {
  public async getPayment(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        startDate,
        endDate,
        type,
        sort,
      } = req.query;

      const query: any = {};
      if (name) query.name = { $regex: new RegExp(String(name), "i") };
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(String(startDate));
        if (endDate) query.createdAt.$lte = new Date(String(endDate));
      }
      if (type) query.type = type;

      const payments = await paymentModel
        .find(query)
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .limit(parseInt(limit as string, 10))
        .skip(
          (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10)
        )
        .exec();

      const total = await paymentModel.countDocuments(query).exec();

      res.json({
        result: payments,
        total,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSinglePayment(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const payment = await paymentModel.findById(id);
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });

      res.status(200).json({
        success: true,
        message: "Fetch single payment successfully",
        result: payment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
  public async deletePayment(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const payment = await paymentModel.findById(id);
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });
    
      await paymentModel.findByIdAndDelete(id)

      res.status(200).json({
        success: true,
        message: "Deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default PaymentController;
