import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express";
const app = express();


app.use(express.json({limit:'1000000kb'}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// router import
import userrouter from "./routes/user.route.js";
// router declaration
app.use("/api/v1/users", userrouter)

export { app };