import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registeruser,
    login,
    logout
} from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    , registeruser
)
router.route("/login").post(upload.none(), login);
router.route("/logout").post(verifyJWT, logout)

export default router