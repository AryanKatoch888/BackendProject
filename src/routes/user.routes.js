import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middlewear.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "Avator",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
