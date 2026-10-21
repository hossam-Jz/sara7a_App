import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true,"content is Required"],
      minLength: [1,"message must be at least 1 character "],
      maxLength: [500,"message cannot exceed 500 characters"],
      trim:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    isFavorite:{
        type:Boolean,
         default:false
    }
  },
  { timestamps: true },
);
    messageSchema.index({receiverId:1})
const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
