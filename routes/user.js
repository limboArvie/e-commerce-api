const express = require("express");

const userController = require("../controllers/user");
const { verifyToken, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/", userController.createUser);

router.post("/login", userController.loginUser);

router.put("/:userId/update", verifyToken, userController.updateUser);

router.put(
  "/:userId/reset-password",
  verifyToken,
  userController.updateUserPassword
);

router.put(
  "/:userId/update-role",
  verifyToken,
  verifyAdmin,
  userController.updateUserRole
);

router.put(
  "/:userId/update-admin",
  verifyToken,
  verifyAdmin,
  userController.updateUserAsAdmin
);

router.put(
  "/:userId/approve-seller",
  verifyToken,
  verifyAdmin,
  userController.updateUserAsSeller
);

router.get("/profile", verifyToken, userController.getUserProfile);

router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);

router.get("/:userId", verifyToken, verifyAdmin, userController.getUserInfo);

module.exports = router;
