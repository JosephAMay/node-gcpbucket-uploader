import express from "express";
import multer from "multer";
import {v1 as uuidv1} from "uuid";
import bcrypt from "bcrypt";
const saltRounds = 10;
const app = express();
import uploader from "./services/uploader.js";
import connection from './services/database.js';

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

//Get a user's information using the id that was returned from the POST /user
  app.route('/user/:user_id')
  .get(function(req, res) {
    connection.query(
      "SELECT * FROM `user` WHERE user_id = ?", req.params.user_id,
      function(error, results) {
        if(error){
          console.log(error);
          res.status(500).send({message:"There was an error connecting to the database: ", error });
        }
        console.log("Database query successful: ", results)
        res.status(200).json(results);
      }
    );
  });

  //Insert a new row into the user table. Request body must contain a password and full name at minimum 
  //The user_id is generated right here and the password is encrypted before being stored in the DB.
  app.route('/user')
  .post( async function(req, res) {
    const {password, first_name, last_name, email, phone_number } = req.body;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    
    let user_id = uuidv1();
    connection.query(
      "INSERT INTO user (user_id, password, first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)", [user_id, encryptedPassword, first_name, last_name, email, phone_number],
      function(error, results) {
        if(error){
          console.log(error);
          res.status(500).send({message:"There was an error connecting to the database: ", error });
        }
        console.log("Database insert successful: ", user_id);
        res.status(200).json({user_id: user_id, results: results});
      }
    );
  });

const expressServer = app.listen(5000, () => {
  console.log("listening on port 5000");
});
