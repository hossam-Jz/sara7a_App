import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
    jti:{
        type: String,
        required: true,
        unique: true
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresIn:{
        type: Date,
        required: true
    },

},{timestamps: true});

const tokenModel = mongoose.model('Token', tokenSchema);

export default tokenModel;