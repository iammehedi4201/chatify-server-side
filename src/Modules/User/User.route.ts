import { authorize } from "@/helper/errorHelper/authorize";
import { Router } from "express";
import { UserController } from "./User.controller";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put(
  "/chaneRole/:id",
  authorize("Admin", "Super_Admin"),
  UserController.updateUser,
);
router.delete(
  "/:id",
  authorize("Admin", "Super_Admin"),
  UserController.deleteUser,
);

export const UserRoutes = router;
