import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json("16kb")); // set the data limit which is coming to the server
app.use(express.urlencoded({extended: true, limit: "16kb"})); //endcoded the url 
app.use(express.static("public")) //store image files in public folder
app.use(cookieParser()); // use crud operation to change cookies from server
export {app};