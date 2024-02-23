import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req: Request, file, cb) => {
    cb(null, file.originalname);
  },
});

const singleUpload = multer({ storage }).single("file");

export default singleUpload;
