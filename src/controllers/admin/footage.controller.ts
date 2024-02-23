import { Request, Response } from "express";
import MSG from "@utils/locale.en.json";
import { validationResult } from "express-validator";
import { RequestWithUser } from "@/interfaces/auth.interface";
import footageModel from "@/models/foogate.model";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Footage } from "@/interfaces/footage.interface";
import { deleteFile, uploadAndPushFile } from "@/bucket";

interface Query {
  name: object;
  state: string;
  city: string;
  date: object;
}

cloudinary.config({
  cloud_name: "dcdwbdzql",
  api_key: "916793923444751",
  api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});

class AdminFootageController {
  // get profile
  public async uploadFootage(req: RequestWithUser, res: Response) {
    try {
      const { name, price, id, state, city, date, time, description } =
        req.body;

      if (!id) return res.status(400).json({ message: "Id is required" });
      if (!name) return res.status(400).json({ message: "Name is required" });
      if (!price) return res.status(400).json({ message: "Price is required" });

      console.log(req?.files);

      const photoFile = req?.files["photo"];
      const videoFile = req?.files["video"];

      console.log("photo", photoFile);
      console.log("Photo File Data Length:", photoFile.data.length);

      if (!photoFile) {
        return res.status(400).json({ message: "Thumbnail is required" });
      }
      if (!videoFile) {
        return res.status(400).json({ message: "Video is required" });
      }
      const footage = await footageModel.findOne({ id });

      console.log(footage);

      if (footage) return res.status(400).json({ message: "Id already taken" });

      const options = {
        name,
        price,
        id,
        state: state !== "undefined" ? state : "",
        city: city !== "undefined" ? city : "",
        date: date !== "undefined" ? date : "",
        time: time !== "undefined" ? time : "",
        description: description !== "undefined" ? description : "",
      } as Footage;

      if (photoFile) {
        const data = (await uploadAndPushFile(
          "footage/images",
          photoFile,
          photoFile?.name,
          ""
        )) as {
          Location?: string;
          Key?: String;
        };

        options.thumbnail = data?.Location;
        options.thumbnailPublicKey = data?.Key;
      }

      if (videoFile) {
        const data = (await uploadAndPushFile(
          "footage/videos",
          videoFile,
          videoFile?.name,
          ""
        )) as {
          Location?: string;
          Key?: String;
        };

        options.video = data?.Location;
        options.videoPublicKey = data?.Key;
      }

      const newFootage = new footageModel(options);

      console.log(options);
      console.log("object", newFootage);
      await newFootage.save();
      res.status(200).json({
        success: true,
        response: newFootage,
        message: "Footage uploaded successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async editFootage(req: RequestWithUser, res: Response) {
    try {
      const {
        id,
        name,
        price,
        state,
        city,
        date,
        time,
        thumbnailPublicKey,
        description,
        videoPublicKey,
      } = req.body;

      console.log(req.body?.name);

      const { footageId } = req.params;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      let footage = await footageModel.findById(footageId);
      if (!footage)
        return res.status(400).json({ message: "Footage not found" });

      const photoFile = (req?.files as { photo?: any })?.photo;
      const videoFile = (req?.files as { video?: any })?.video;

      // const photoFile = req?.files["photo"];
      // const videoFile = req?.files["video"];

      if (footage?.id !== id) {
        const existingFootage = await footageModel.findOne({ id });
        if (existingFootage)
          return res.status(400).json({ message: "Id already taken" });
      }

      if (photoFile) {
        const photoData = (await uploadAndPushFile(
          "footage/images",
          photoFile,
          photoFile.name,
          ""
        )) as {
          Location?: string;
          Key?: String;
        };

        await deleteFile("collisioncam-images/", String(thumbnailPublicKey));

        footage.thumbnail = photoData?.Location;
        footage.thumbnailPublicKey = photoData?.Key;
      }

      // Upload video if provided
      if (videoFile) {
        const videoData = (await uploadAndPushFile(
          "footage/videos",
          videoFile,
          videoFile.name,
          ""
        )) as {
          Location?: string;
          Key?: String;
        };

        await deleteFile("collisioncam-images/", String(videoPublicKey));

        footage.video = videoData?.Location;
        footage.videoPublicKey = videoData?.Key;
      }

      if (id) {
        footage.id = id;
      }

      if (name) {
        footage.name = name;
      }
      if (price) {
        footage.price = price;
      }
      if (state) {
        footage.state = state;
      }
      if (city) {
        footage.city = city;
      }
      if (date) {
        footage.date = date;
      }
      if (time) {
        footage.time = time;
      }
      if (description) {
        footage.description = description;
      }

      await footage.save();

      res.status(200).json({
        success: true,
        response: footage,
        message: "Footage updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  // Register
  public async getFootageAdmin(req: Request, res: Response) {
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
        .select("-video -videoPublicKey")
        .sort(sortOptions)
        .limit(documentsLimit)
        .skip(startIndex);

      res.status(200).json({ success: true, result: results, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSingleFootage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) return res.status(404).json({ message: "ID is required" });

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const footage = await footageModel
        .findById(id)
        .select("-video -videoPublicKey");
      if (!footage)
        return res.status(400).json({ message: "Footage is not avaiable" });

      res
        .status(200)
        .json({ success: true, message: MSG.FETCH_SUCCESS, result: footage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSingleFootagePrivate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) return res.status(404).json({ message: "ID is required" });

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const footage = await footageModel.findById(id);
      if (!footage)
        return res.status(400).json({ message: "Footage is not avaiable" });

      res
        .status(200)
        .json({ success: true, message: MSG.FETCH_SUCCESS, result: footage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async deleteFootage(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const footage = await footageModel.findById(id);
      if (!footage)
        return res.status(404).json({ message: "Footage not found" });

      await footageModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Footage deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default AdminFootageController;
