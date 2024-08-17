// require('dotenv').config({
//     path:'./env'
// });
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`**** Server listening on ${process.env.PORT} **** Happy Coding ****`);
    });
  })
  .catch(err => {
    console.log("mongodb error connection failed : ", err);
  });

/*
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    app.on("error", error => {
      console.log("ERROR :", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log("App is listening on port", process.env.PORT);
    });
  } catch (e) {
    console.log("ERROR :", e);
    throw e;
  }
})();
*/
