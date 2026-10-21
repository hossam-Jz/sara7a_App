import {
  findOne,
  create,
  findById,
  updateOne,
  findOneAndUpdate,
} from "../../DB/DB.repository.js";
import { userModel } from "../../DB/Models/user.model.js";
import { hashEnum } from "../../Utils/enums/security.enum.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/respones/err.respones.js";
import { successResponses } from "../../Utils/respones/success.respones.js";
import { encrypt } from "../../Utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/security.hash.js";
import { getNewLoginCredentials } from "../../Utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import { ACCESS_USER_SECRET_TOKEN_EXPIRES_IN, CLIENT_ID } from "../../config/config.service.js";
import { providerEnum } from "../../Utils/enums/user.enum.js";

import { logoutTypeEnum } from "../../Utils/enums/user.enum.js";
import tokenModel from "../../DB/Models/token.model.js";
import { sendMail, emailSubject } from "../../Utils/emails/email.Utlis.js";
import { template } from "../../Utils/emails/generateHTML.js";
import { emailEvents } from "../../Utils/events/email.event.js";
import { generateOTP } from "../../Utils/generateOtp.js";
import { revokeTokenKey, set } from "../../DB/Models/redis.service.js";

export const signup = async (req, res) => {
  const { userName, email, password, gender, phone ,role} = req.body;
  const Existuser = await findOne({
    model: userModel,
    filter: { email },
  });
  if (Existuser) ConflictException({ message: " email already exist" });
  const otp = await generateOTP();
  const OTPHashed = await generateHash({
    plainText: otp,
    algorithm: hashEnum.bcrypt,
  });
  const hashPassword = await generateHash({
    plainText: password,
    saltRound: 10,
    algorithm: hashEnum.bcrypt,
  });

  const encryptPhone = await encrypt(phone);

  const user = await create({
    model: userModel,
    data: {
      userName,
      email,
      password: hashPassword,
      gender,
      phone: encryptPhone,
      confirmEmailOTP: OTPHashed,
      role
    },
  });
  
  emailEvents.emit("confirmEmail", {
    to: email,
    otp,
    userName,
  });
  return successResponses({
    res,
    message: "user Signup successfuly",
    data: user,
  });
};
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await findOne({
    model: userModel,
    filter: {
      email,
      confirmEmailOTP: { $exists: true },
      confirmEmail: { $exists: false },
    }
  });

  if (!user) throw NotFoundException({ message: "user not found" });

  const isMatch = await compareHash({
    plainText: otp,
    cipherText: user.confirmEmailOTP,
    algorithm: hashEnum.bcrypt,
  });

  if (!isMatch) throw NotFoundException({ message: "invalid OTP" });

 await updateOne({
  model:userModel,
  filter:{email},
  data:{
    confirmEmail:Date.now(),
    $unset:{
      confirmEmailOTP:true
    }
  }
 })

  return successResponses({
    res,
    statusCode:200,
    message: "user confirmed successfuly",
  
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findOne({
    model: userModel,
    filter: { email,confirmEmail:{$exists:true} },
  });

  if (!user) throw NotFoundException({ message: "user not found or your Email not confirmed" });
 

  const isMatch = await compareHash({
    plainText: password,
    cipherText: user.password,
    algorithm: hashEnum.bcrypt,
  });

  if (!isMatch) throw NotFoundException({ message: "invalid password" });

  const token = await getNewLoginCredentials(user);

  return successResponses({
    res,
    message: "user login successfuly",
    data: { token },
  });
};

async function verifyGoogleAccont({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogleAccont({ idToken });

  if (!email_verified) BadRequestException({ message: "Email not verified" });

  const user = await findOne({ model: userModel, filter: { email } });

  if (user) {
    if (user.provider !== providerEnum.GOOGLE)
      ConflictException({
        message: "Email already exists with another provider",
      });

    const credentials = await getNewLoginCredentials(user);

    return successResponses({
      res,
      massage: "login successfully",
      statusCode: 200,
      data: { credentials },
    });
  }
  const newUser = await create({
    model: userModel,
    data: {
      firstName: given_name,
      lastName: family_name,
      email,
      profilePic: picture,
      provider: providerEnum.GOOGLE,
    },
  });

  const credentials = await getNewLoginCredentials(newUser);

  return successResponses({
    res,
    message: "login successfully",
    statusCode: 201,
    data: {
      credentials,
    },
  });
};
export const logout = async (req, res) => {
  const { flag } = req.body;

  let status = 200;

  switch (flag) {
    case logoutTypeEnum.logout:
      await create({
        model: tokenModel,
        data: {
          jti: req.decoded.jti,
          userId: req.decoded.id,
          expiresIn: new Date(req.decoded.exp * 1000),
        },
      });
      status = 201;
      break;
    case logoutTypeEnum.logoutFromAllDevices:
      await updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: { changeCredindialsTime: Date.now() },
      });
      status = 200;
  }
  return successResponses({
    res,
    message: "logout successfully",
    statusCode: status,
  });
};

export const forgetPassword = async (req,res)=>{
  const {email} = req.body;

  const otp = generateOTP();

  const hashOtp = await generateHash({
    plainText: otp,
    algorithm:hashEnum.bcrypt
  });

  const user = await findOneAndUpdate({
    model:userModel,
     filter: {
    email,
    confirmEmail: { $exists: true },
    provider: providerEnum.SYSTEM,
  },
    data:{
      frogetPasswordOtp:hashOtp,
    }
  })

  if(!user) throw NotFoundException({message:"User Not Found"});
  emailEvents.emit("forgetPassword",{
    to:email,
    userName:user.userName,
    otp
  });

  return successResponses({
    res,
    message:"check Your Inbox"
  })
}

export const resetPassword = async (req,res)=>{
  const {email,otp,newPassword} = req.body;

  const user = await findOne({
    model:userModel,
    filter:{
      email,
      provider:providerEnum.SYSTEM,
      confirmEmail:{$exists:true},
      frogetPasswordOtp:{$exists:true}

    }
  });

  if(!user) throw NotFoundException({message:"user Not Found"});

  const isVaildOtp = await compareHash({
    plainText:otp,
    cipherText:user.frogetPasswordOtp,
    algorithm:hashEnum.bcrypt
  });

  if(!isVaildOtp) throw BadRequestException({message:"invalid OTP"});

  const hashNewPassword = await generateHash({
    plainText:newPassword,
    algorithm:hashEnum.bcrypt
  });

  await updateOne({
    model:userModel,
    filter:{email},
    data:{
      password:hashNewPassword,
      $unset:{frogetPasswordOtp:true}
    }
  });

  return successResponses({
    res,
    message:"password rest successfully"
  })

}
export const logoutWithRedis = async (req, res) => {
  const { id, jti, exp } = req.decoded;
  const ttl = exp - Math.floor(Date.now() / 1000);

  if (ttl > 0) {
    await set({
      Key: revokeTokenKey({ userId: id, jti }),
      Value: jti,
      ttl,
    });
  }

  return successResponses({
    res,
    message: "Logout Successfuly",
    statusCode: 200,
  });
};

