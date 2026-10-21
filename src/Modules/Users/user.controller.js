import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { authorization } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { roleEnum } from "../../Utils/enums/user.enum.js";
import * as userService from "./useR.service.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
const router = Router();

router.post(
  "/profile",
  authentication({
    tokenType: tokenTypeEnum.ACCESS,
  }),
  authorization({
    accessRole: [roleEnum.USER, roleEnum.ADMIN],
  }),
  userService.getprofile,
);
router.patch(
  "/upload-file", // upload profile pic`
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.image],
  }).single("attachment"),
  userService.updateProfilePic,
);
router.patch(
  "/upload-video",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.video],
  }).array("attachment", 5),
  userService.updateVideo,
);
router.patch(
  "/upload-cover-images", // upload multiple images
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.image],
  }).array("attachment", 5),
  userService.updateCoverPics,
);
router.patch(
  "/update-Password", 
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(userValidation.updatePasswordSchema),
  userService.updatePassword,
);
router.patch(
  "{/:userId}/freeze-account", 
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(userValidation.freezeSchema),
  userService.freezeAccount,
);
router.patch(
  "{/:userId}/resotre-account", // OPTIONAL PARAMS
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(userValidation.freezeSchema),
  userService.resoreAccount,
);
router.delete(
  "/:userId/dard-Dlete-account", 
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [ roleEnum.ADMIN] }),
  validation(userValidation.hardDeleteSchema),
  userService.hardDelete,
);

export default router;
