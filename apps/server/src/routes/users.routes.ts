import { Request, Router } from "express";
import multer from "multer";
import path from "path";
import * as userController from "../controllers/user.controller";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req: Request, _file, cb) => {
      cb(null, path.join(__dirname, "../assets"));
    },
    filename: (_req: Request, file, cb) => {
      const filename = file.originalname.split(".");
      cb(null, `${filename[0]}-${Date.now()}.${filename[1]}`);
    },
  }),
});

const router = Router();

router.get("/", userController.getUsers);
router.get("/contacts", userController.getUserContacts);
router.post("/add-contact", userController.addContact);
router.patch("/get-started", upload.single("profile"), userController.updateUser);
router.patch("/profile", upload.single("profile"), userController.updateUser);
router.patch("/profile/delete", userController.deleteProfilePicture);

export default router;
