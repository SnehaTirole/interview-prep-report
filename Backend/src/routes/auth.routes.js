const express=require("express");
const authController=require("../controllers/auth.controller")
const authRouter=express.Router();
const authMiddleware=require("../middlewares/auth.middleware")
/* 
    POST  /api/auth/register
*/

authRouter.post("/register",authController.registerUserController)

/** 
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
  */
authRouter.post("/login",authController.loginController);

/** 
 * @route get /api/auth/logout
 * @description clear token user cookie and the token in blacklist
 * @access  Private  
  */
authRouter.get("/logout",authController.logoutUserController)

/** 
 * @route GET /api/auth/get-me
 * @description get the current logged in details
 * @access Private 
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter;