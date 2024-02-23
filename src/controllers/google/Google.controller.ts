import {
  RequestWithUser,
} from "@/interfaces/auth.interface";
import { Response } from "express";
import MSG from "@utils/locale.en.json";
import axios from "axios";


class GoogleController {
  public async getReviews(req: RequestWithUser, res: Response) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process?.env?.GOOGLE_MAP_ID}&key=${process.env.GOOGLE_MAP_API_KEY}`;

        const response = await axios.get(url);


      res.status(200).json({
        success: true,
        message: "Successfully",
        results: response?.data?.result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default GoogleController;
