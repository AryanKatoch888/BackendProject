// require('dotenv').config({path: "./env"});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});



connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });

  
// import express from "express"
// const app = express()
// //if e
// ;(async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
//         app.on("error", (error)=> {
//             console.error(error);
//             throw error
//         })
//         app.listen(process.env.PORT, ()=> {
//             console.log(`App is listning on ${process.env.PORT}` )
//         })
//     }
//     catch(error){
//         console.error("Error ", error);
//         throw error;
//     }
// })();
