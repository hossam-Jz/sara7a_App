import { decrypt } from "../../Utils/security/encryption.security.js";
import { successResponses } from "../../Utils/respones/success.respones.js";
import {
  deleteOne,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
  updateOne,
} from "../../DB/DB.repository.js";
import { userModel } from "../../DB/Models/user.model.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/security.hash.js";
import { hashEnum } from "../../Utils/enums/security.enum.js";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/respones/err.respones.js";
import { roleEnum } from "../../Utils/enums/user.enum.js";

export const getprofile = async (req, res) => {
  const { user } = req;

  if (user.phone) user.phone = decrypt(user.phone);

  return successResponses({
    res,
    message: " Welcome",
    stausCode: 200,
    data: user,
  });
};

export const updateProfilePic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user._id,
    data: { profilePic: req.file.finalPath },
  });
  return successResponses({
    res,
    message: " fileUploaded",
    statusCode: 200,
    data: user,
  });
};
export const updateVideo = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user._id,
    data: { ProfileVideo: req.files.map((file) => file.finalPath) },
  });
  return successResponses({
    res,
    message: " fileUploaded",
    statusCode: 200,
    data: user,
  });
};
export const updateCoverPics = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user._id,
    data: { coverPic: req.files.map((file) => file.finalPath) },
  });
  return successResponses({
    res,
    message: " fileUploaded",
    statusCode: 200,
    data: user,
  });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const isValidPassword = await compareHash({
    plainText: oldPassword,
    cipherText: req.user.password,
    algorithm: hashEnum.bcrypt,
  });
  if (!isValidPassword)
    throw BadRequestException({ message: "invalid Pssword" });
  if (oldPassword === newPassword)
    throw BadRequestException({
      message: "new password must different from old password",
    });

  const hashPaswword = await generateHash({
    plainText: newPassword,
    algorithm: hashEnum.bcrypt,
  });

  await updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      password: hashPaswword,
    },
  });
  return successResponses({
    res,
    message: "password updated successfuly",
  });
};

export const freezeAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;

  if (
    targetUserId.toString() !== req.user._id.toString() &&
    req.user.role !== roleEnum.ADMIN
  )
    throw ForbiddenException({
      message: "You are not authorized to freeze this account",
    });

  const updateUser = await findOneAndUpdate({
    model: userModel,
    filter: {
      _id: targetUserId,
      frezzedAt: { $exists: false },
    },
    data: {
      freezedBy: req.user._id,
      frezzedRole: req.user.role,
      frezzedAt: Date.now(),
      $unset: { restoredBy: true, restoresAt: true },
    },
  });

  if (!updateUser)
    throw NotFoundException({
      message: "user not found or account is already forzen",
    });

  return successResponses({
    res,
    message: "forezed suuccefuly",
    statusCode: 200,
    data: { updateUser },
  });
};

export const resoreAccount = async (req, res) => {
  const { userId } = req.params;

  const targetUserId = userId || req.user._id;

  const user = await findById({
    model: userModel,
    id: targetUserId,
  });
  if (!user || !user.frezzedAt)
    throw ForbiddenException({
      message: "user not found or Account is not frozen",
    });

  if (user.frezzedRole === roleEnum.ADMIN) {
    if (req.user.role !== roleEnum.ADMIN)
      throw ForbiddenException({
        message:
          "this account was forzen By an Admin only an Admin can restore it ",
      });
  } else {
    if (
      targetUserId.toString() !== req.user._id.toString() &&
      req.user.role != roleEnum.ADMIN
    )
      throw ForbiddenException({ message: "You Are not authorized to restore this account" });
  }

  const updateUser = await findOneAndUpdate({
    model:userModel,
    filter:{
      _id:targetUserId
    },
    data:{
      restoresAt:Date.now(),
      restoredBy:req.user._id,
      $unset:{frezzedAt:true,frezzedRole:true,freezedBy:true}
    }
  })

  return successResponses({
    res,
    message: "restored successfuly",
    statusCode:200,
    data:{updateUser}
  });
};

export const hardDelete = async (req,res)=>{
  const {userId} = req.params;
  const results = await deleteOne({
    model:userModel,
    filter:{_id:userId}
  });
  if(!results.deletedCount) throw NotFoundException({message:"user not found",extra:results});

    return successResponses({
    res,
    message: "user deleted successfuly",
    statusCode:200,
      data:{results}
  });
}