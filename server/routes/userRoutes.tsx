import express from "express";
const expressRouter = express.Router();
import userController from "@controllers/userController";

const {
    searchUsers,
    // createUser,
    // logIn,
    logOut,
    getProfile,
    updateProfilePhoto,
    updateProfile,
    resetPassword,
    verifyEmail,
    deleteUser,
} = userController;

// User routes
expressRouter.get("/users", searchUsers);
// expressRouter.post("/register", createUser);
// expressRouter.post("/login", logIn);
expressRouter.post("/logout", logOut);
expressRouter.get("/profile", getProfile);
expressRouter.put("/profile/photo", updateProfilePhoto);
expressRouter.put("/profile", updateProfile);
expressRouter.post("/reset-password", resetPassword);
expressRouter.get("/verify-email/:token", verifyEmail);
expressRouter.delete("/delete-profile", deleteUser);

export default expressRouter;
