import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();

router.post("/signup",validation(authValidation.signupSchema) ,authService.signup);
router.post("/login", validation(authValidation.loginSchema), authService.login);
router.patch("/confirmEmail", validation(authValidation.confirmEmailSchema), authService.confirmEmail);
router.patch("/forgetPassword", validation(authValidation.forgetPasswordSchema), authService.forgetPassword);
router.patch("/resetPassword", validation(authValidation.resetPasswordSchema), authService.resetPassword);
router.post("/social-login",authService.loginWithGoogle);
router.post("/logout",authentication({ tokenType: tokenTypeEnum.ACCESS }),authService.logout);
router.post("/logout-With-Redis",authentication({tokenType:tokenTypeEnum.ACCESS}),authService.logoutWithRedis);
export default router;
 