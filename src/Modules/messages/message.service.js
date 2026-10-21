import { create, findOne,find, countDocuments, findById } from "../../DB/DB.repository.js";
import messageModel from "../../DB/Models/message.model.js";
import { NotFoundException } from "../../Utils/respones/err.respones.js";
import { successResponses } from "../../Utils/respones/success.respones.js";
import {userModel} from "../../DB/Models/user.model.js"
export const sendMessage = async (req,res)=>{
    const {receiverId} = req.params;
    const {content} = req.body;

    const receiver = await findOne({
        model:userModel,
        filter:{
            _id:receiverId,
            frezzedAt:{$exists:false}
        },
    });
    if(!receiver) throw NotFoundException({message:"receiver Noot Found Or Account Is Freezed "});
    const message = await create({
        model:messageModel,
        data:{content,receiverId}
    });

    successResponses({
        res,
        message:"message send successfuly",
        statusCode:201,
        data:{message}
    });
};
export const getMessages = async (req,res)=>{
    const {page=1 , limit=2} = req.query;
    const receiverId = req.user._id;
    const skip = (page-1)*limit;

 const [messages, totalMessages] = await Promise.all([
    find({
      model: messageModel,
      filter: { receiverId },
     options: {
  sort: { createdAt: -1 },
  skip: Number(skip),
  limit: Number(limit)
},
    }),
    countDocuments({
      model: messageModel,
      filter: { receiverId },
    }),
  ]);
  successResponses({
    res,
    message:"inbox retrived successfuly",
    statusCode:200,
    data:{
        messages,
        pagination:{
            currentPage:Number(page),
            totalPages:Math.ceil(totalMessages/limit),
            totalMessages
        }
    }
  })

};
export const toggleRead = async(req,res)=>{
    const {messageId} = req.params;
    const messageOwner = req.user._id; // صحب الرساله

    const message = await findById({
        model:messageModel,
        id:messageId
    });
    if(!message || message.receiverId.toString() !== messageOwner.toString() ) throw NotFoundException({message:'message Not Found Or Unauthorized'});

    message.isRead =!message.isRead;
    await message.save();

    successResponses({
        res,
        message:`message Marked as ${message.isRead ? "read" : "unRead"}`,
        data:{
            updatedMessages:message
        }
    })
}

export const toggleFavorites = async(req,res)=>{
    const {messageId} = req.params;
    const messageOwner = req.user._id; 

    const message = await findById({
        model:messageModel,
        id:messageId
    });
    if(!message || message.receiverId.toString() !== messageOwner.toString() ) throw NotFoundException({message:'message Not Found Or Unauthorized'});

    message.isFavorite =!message.isFavorite;
    await message.save();

    successResponses({
        res,
        message: message.isFavorite ? "Added To Favotite" : "Removed From favorite",
        data:{
            updatedMessages:message
        }
    })
}