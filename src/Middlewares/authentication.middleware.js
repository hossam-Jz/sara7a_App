import { findById } from "../DB/DB.repository.js";
import { userModel } from "../DB/Models/user.model.js";
import { signatureEnum, tokenTypeEnum } from "../Utils/enums/user.enum.js";
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "../Utils/respones/err.respones.js";
import { getSignature, verifyToken } from "../Utils/token/token.js";
import jwt from "jsonwebtoken";
import tokenModel from "../DB/Models/token.model.js";
import { findOne } from "../DB/DB.repository.js";
import { get, revokeTokenKey } from "../DB/Models/redis.service.js";

export const docededToken = async ({
  authorization,
  tokenType = tokenTypeEnum.ACCESS,
}) => {
  const [Bearer, token] = authorization.split(" ") || [];

  let signature = await getSignature({
    signatureLevel:
      Bearer === "ADMIN"
        ? signatureEnum.ADMIN
        : Bearer === "USER"
          ? signatureEnum.USER
          : BadRequestException({ message: "Invalid signature" }),
  });
  const decoded = await verifyToken({
    token,
    secretKey:
      tokenType === tokenTypeEnum.ACCESS
        ? signature.accessSignature
        : signature.refreshSignature,
  });
  const isRevoked = await get({
    Key: revokeTokenKey({ userId: decoded.id, jti: decoded.jti }),
  });

  if (isRevoked) throw UnauthorizedException({ message: "token Is revoked " });
  if (await findOne({ model: tokenModel, filter: { jti: decoded.jti } }))
    throw UnauthorizedException({ message: "Token is revoked" });
  const user = await findById({ model: userModel, id: decoded.id });
  if (!user) NotFoundException({ message: "user not found" });
  if ((user.changeCredindialsTime?.getTime() || 0) > decoded.iat * 1000)
    throw UnauthorizedException({ message: "Invalid token" });
  return { user, decoded };
};

export const authentication = ({ tokenType = tokenTypeEnum.ACCESS }) => {
  return async (req, res, next) => {
    const { user, decoded } =
      (await docededToken({
        authorization: req.headers.authorization,
        tokenType,
      })) || {};

    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRole = [] }) => {
  return async (req, res, next) => {
    if (!accessRole.includes(req.user.role))
      throw ForbiddenException({ message: "Unauthorized" });
    return next();
  };
};
