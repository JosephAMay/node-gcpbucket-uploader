import express from "express";
import multer from "multer";
import path from "path";
const app = express();
import uploader from "./services/uploader.js";

app.use(express.json());

/* FOR LOCAL FILE UPLOAD 
// Also as second argument to app.post():
// upload.single("uploaded_file"),

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });
*/

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(multerMid.single("uploaded_file"));

app.post("/upload", async (req, res) => {
  console.log("File upload attempted:");
  console.log(req.file);
  try {
    const fileUrl = await uploader(req.file);
    res.status(200).json({ message: "File upload successful", data: fileUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was an error uploading the file");
  }
});

const expressServer = app.listen(5000, () => {
  console.log("listening on port 5000");
});
