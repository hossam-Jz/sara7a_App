import { Router } from "express";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as messageValidation from "./message.validation.js ";
import * as messageService from "./message.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post(
  "/send-message/:receiverId",
  validation(messageValidation.sendMessageSchema),
  messageService.sendMessage,
);

router.get(
  "/",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  messageService.getMessages,
);
router.patch("/:messageId/read",authentication({ tokenType: tokenTypeEnum.ACCESS }),
validation(messageValidation.toggleReadSchema),
  messageService.toggleRead);
  
router.patch("/:messageId/favotite",authentication({ tokenType: tokenTypeEnum.ACCESS }),
validation(messageValidation.toggleFavotiteSchema),
  messageService.toggleFavorites);

export default router;
